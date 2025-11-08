import { useState } from "react";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { UserProfile } from "./UserProfile";
import { SettingsPanel } from "./SettingsPanel";

interface ChatInterfaceProps {
  user: { id: string; name: string; email: string; role: "user" | "admin" };
  onLogout: () => void;
  onSwitchToAdmin?: () => void;
}

export interface Conversation {
  id: number;
  user_id: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isGroup: boolean;
  isOnline?: boolean;
  aes_key: {
    key: CryptoKey
  } ;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}


export function ChatInterface({
  user,
  onLogout,
  onSwitchToAdmin,
}: ChatInterfaceProps) {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [conversations,setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>({});
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: user.name,
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with conversations */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          addConversation={(conversation)=>{
            setConversations((prev)=>[...prev, conversation])
          }}
          user={user}
          onLogout={onLogout}
          onSwitchToAdmin={onSwitchToAdmin}
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
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
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
