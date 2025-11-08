import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConversationList } from "../components/ConversationList";
import { ChatWindow } from "../components/ChatWindow";
import { UserProfile } from "../components/UserProfile";
import { useUserStore } from "../store/userStore";
import { getSocket, sock_emit } from "../utils/Socket";
import { MessageSquare } from "lucide-react";
import type { Conversation, Message } from "@/components/ChatInterface";
import { decryptAESKey, type GoChatSession, type GoUser } from "@/components/NewChatPanel";
import { AESDecrypt, AESEncrypt, base64ToBigint, base64ToUint8Array, uint8ArrayToBase64 } from "@/utils/AES";
import type { Socket } from "socket.io-client";
import { fetcher, postRequest } from "@/utils/APIHelper";
import type { Response } from "@/utils/Response";

export type GoChatMessage = {
  id: number;
  sender_id: number;
  receiver_id: number;
  session_id: number;
  content: string;
  iv: string;

  is_read: boolean;
  created_at: string;
  updated_at: string;

  Sender: GoUser;
  Receiver: GoUser;
}



export function ChatPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const switchToAdmin = useUserStore((state) => state.switchToAdmin);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>({});
  const [showProfile, setShowProfile] = useState(false);

  const [authSockLoading, setAuthSockLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSwitchToAdmin = () => {
    switchToAdmin();
    navigate("/admin");
  };

  const sockAuthSuccessHandler = useCallback(() => {
    setAuthSockLoading(false);
  }, [setAuthSockLoading]);

  const sockAuthFailHandler = useCallback(async (msg: string) => {
    setAuthSockLoading(false);

    sessionStorage.removeItem("token");
    localStorage.removeItem("token");

    logout();

    window.location.href = "/";
  }, [setAuthSockLoading]);

  const newSessionHandler = useCallback(async (session: GoChatSession) => {
    if (conversations.find((c) => c.id === session.id)) {
      return;
    }
    const a1 = session.a1;
    const aes_key = await decryptAESKey(a1);
    const newConversation: Conversation = {
      id: session.id,
      user_id: session.User2.id,
      name: session.User2.name,
      lastMessage: "",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      unread: 0,
      isGroup: false,
      aes_key: {
        key: aes_key
      },
    };
    setConversations((prev) => [...prev, newConversation]);
  }, [conversations, setConversations]);

  const sockMsgHandler = useCallback(async (msg: GoChatMessage) => {
    console.log("Received message:", msg);

    const sender_id = msg.sender_id;
    const conversation = conversations.find((c) => c.user_id == sender_id);

    if (!conversation) {
      console.warn("Conversation not found for sender_id:", sender_id);
      console.log("Existing conversations:", conversations);
      return;
    }
    const aes_key = conversation.aes_key.key;

    const encryptedContent = base64ToUint8Array(msg.content);
    const iv = base64ToUint8Array(msg.iv);

    const decryptedContent = await AESDecrypt(encryptedContent, aes_key, iv)
    const newMessage: Message = {
      id: msg.id.toString(),
      senderId: msg.sender_id.toString(),
      content: decryptedContent.decrypted,
      senderName: conversation.name,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isOwn: false,
    };

    setMessages((prev) => ({
      ...prev,
      [conversation.id]: [
        ...(prev[conversation.id] || []),
        newMessage,
      ],
    }));
  }, [conversations, setMessages, messages]);



  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on("new_chat_session", newSessionHandler);

    return () => {
      if (socket) {
        socket.off("new_chat_session", newSessionHandler);
      }
    };
  }, [newSessionHandler])

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on("new_message", sockMsgHandler);

    return () => {
      if (socket) {
        socket.off("new_message", sockMsgHandler);
      }
    };
  }, [sockMsgHandler])

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    sock_emit(socket, "auth", { token });
    socket.on("auth_success", sockAuthSuccessHandler);
    socket.on("auth_error", sockAuthFailHandler);
    const sessionLoader = async () => {
      const res = await fetcher<Response<GoChatSession[]>>('/chat-session/all');
      if (res.status) {
        const encryptedAesKeys: Record<number, string> = {};

        res.data.forEach((session) => {
          encryptedAesKeys[session.id] = session.a1;
        })

        const decryptedKeys: { session_id: number, key: CryptoKey }[] = await Promise.all(
          Object.entries(encryptedAesKeys).map(async ([session_id, a1]) => {
            const key = await decryptAESKey(a1);
            return {
              session_id: Number(session_id),
              key,
            }
          })
        );

        const conversations: Conversation[] = res.data.map((session) => {
          return {
            id: session.id,
            user_id: session.User2.id,
            name: session.User2.name,
            lastMessage: "",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
            unread: 0,
            isGroup: false,
            aes_key: {
              key: decryptedKeys.find(dk => dk.session_id === session.id)!.key
            },
          }
        })
        console.log("Loaded conversations:", conversations);
        setConversations(() => conversations);
        setSessionLoading(false);
      }
    }
    sessionLoader();

    return () => {
      socketRef.current = null;
      socket.off("auth_success", sockAuthSuccessHandler);
      socket.off("auth_error", sockAuthFailHandler);
    };
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    const aes_key = selectedConversation.aes_key.key;

    // const encryptedMessage = 

    const encryptedMessage = await AESEncrypt(content, aes_key);

    const msg_b64 = uint8ArrayToBase64(encryptedMessage.encrypted);
    const iv_b64 = uint8ArrayToBase64(encryptedMessage.iv);

    const socket = socketRef.current!;

    sock_emit(socket, "send_message", {
      sender_id: user!.id,
      receiver_id: selectedConversation.user_id,
      session_id: selectedConversation.id,
      content: msg_b64,
      iv: iv_b64,
    })

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user!.id,
      senderName: user!.name,
      content,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] || []),
        newMessage,
      ],
    }));
  };

  if (!user) {
    navigate("/");
    return null;
  }

  if (authSockLoading) {
    return <div>Authenticating connection...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with conversations */}
      <div className="w-80 border-r border-gray-200/80 bg-white/90 backdrop-blur-sm flex flex-col shadow-lg shadow-gray-900/5">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          addConversation={(conversation) => {
            setConversations((prev) => [...prev, conversation])
          }}
          user={user}
          onLogout={handleLogout}
          onSwitchToAdmin={
            user.role === "admin" ? handleSwitchToAdmin : undefined
          }
          onShowProfile={() => setShowProfile(true)}
        // onShowSettings={() => setShowSettings(true)}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages[selectedConversation.id] || []}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white">
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Select a conversation
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Panel */}
      {showProfile && (
        <UserProfile user={user} onClose={() => setShowProfile(false)} />
      )}

      {/* Settings Panel */}
      {/* {showSettings && (
        <SettingsPanel user={user} onClose={() => setShowSettings(false)} />
      )} */}
    </div>
  );
}
