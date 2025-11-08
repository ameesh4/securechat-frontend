import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConversationList } from "../components/ConversationList";
import { ChatWindow } from "../components/ChatWindow";
import { UserProfile } from "../components/UserProfile";
import { SettingsPanel } from "../components/SettingsPanel";
import { useUserStore } from "../store/userStore";
import { getSocket, sock_emit } from "../utils/Socket";
import { MessageSquare } from "lucide-react";
import { io } from "socket.io-client";

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isGroup: boolean;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2m ago",
    unread: 2,
    isGroup: false,
    isOnline: true,
  },
  {
    id: "2",
    name: "Design Team",
    avatar:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150",
    lastMessage: "The new mockups look great!",
    timestamp: "15m ago",
    unread: 5,
    isGroup: true,
    isOnline: false,
  },
  {
    id: "3",
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    lastMessage: "Can we schedule a meeting?",
    timestamp: "1h ago",
    unread: 0,
    isGroup: false,
    isOnline: false,
  },
  {
    id: "4",
    name: "Marketing Team",
    avatar:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=150",
    lastMessage: "Campaign results are in!",
    timestamp: "2h ago",
    unread: 1,
    isGroup: true,
    isOnline: false,
  },
  {
    id: "5",
    name: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    lastMessage: "Thanks for your help!",
    timestamp: "1d ago",
    unread: 0,
    isGroup: false,
    isOnline: true,
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "1",
      senderName: "Sarah Johnson",
      content: "Hey! How are you doing?",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: "2",
      senderId: "me",
      senderName: "Me",
      content: "Hi Sarah! I'm doing great, thanks for asking!",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    {
      id: "3",
      senderId: "1",
      senderName: "Sarah Johnson",
      content: "That's wonderful! Are you free for a quick call later?",
      timestamp: "10:33 AM",
      isOwn: false,
    },
  ],
  "2": [
    {
      id: "1",
      senderId: "2",
      senderName: "Alex",
      content: "The new mockups look great!",
      timestamp: "9:15 AM",
      isOwn: false,
    },
    {
      id: "2",
      senderId: "3",
      senderName: "Jessica",
      content: "I agree! The color scheme is perfect.",
      timestamp: "9:20 AM",
      isOwn: false,
    },
    {
      id: "3",
      senderId: "me",
      senderName: "Me",
      content: "Thanks everyone! Glad you like them.",
      timestamp: "9:25 AM",
      isOwn: true,
    },
  ],
};

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

export function ChatPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const switchToAdmin = useUserStore((state) => state.switchToAdmin);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(mockConversations[0]);
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [authSockLoading, setAuthSockLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSwitchToAdmin = () => {
    switchToAdmin();
    navigate("/admin");
  };


  const sockAuthSuccessHandler = useCallback(() => {
    setAuthSockLoading(false)
  }, [setAuthSockLoading])



  useEffect(() => {
    const socket = getSocket();
    
    
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    sock_emit(socket,"auth", { token });
    socket.on("auth_success", sockAuthSuccessHandler);

    return () => {
      if (socket) {
        socket.off("auth_success", sockAuthSuccessHandler);
      }
    };
  }, []);

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "Me",
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
          user={user}
          onLogout={handleLogout}
          onSwitchToAdmin={
            user.role === "admin" ? handleSwitchToAdmin : undefined
          }
          onShowProfile={() => setShowProfile(true)}
          onShowSettings={() => setShowSettings(true)}
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
      {showSettings && (
        <SettingsPanel user={user} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
