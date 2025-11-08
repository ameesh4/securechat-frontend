import { useState } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Search,
  Plus,
  Settings,
  LogOut,
  User,
  Shield,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Conversation } from "./ChatInterface";
import NewChatPanel from "./NewChatPanel";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  addConversation: (conversation: Conversation) => void;
  user: { id: string; name: string; email: string; role: "user" | "admin" };
  onLogout: () => void;
  onSwitchToAdmin?: () => void;
  onShowProfile?: () => void;
  // onShowSettings: () => void;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  addConversation,
  user,
  onLogout,
  onSwitchToAdmin,
}: // onShowSettings,
ConversationListProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header with Search */}
      <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <Button
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-black font-medium shadow-md shadow-blue-500/20 transition-all"
          onClick={() => setNewChatOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {filteredConversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50/80 transition-all border-b border-gray-100/50 group ${
              selectedConversation?.id === conversation.id
                ? "bg-blue-50 hover:bg-blue-50 border-l-4 border-l-blue-600"
                : ""
            }`}
          >
            <div className="relative flex-shrink-0">
              <Avatar
                className={`ring-2 transition-all ${
                  selectedConversation?.id === conversation.id
                    ? "ring-blue-500/30"
                    : "ring-gray-200 group-hover:ring-gray-300"
                }`}
              >
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${
                    conversation?.name || ""
                  }`}
                />
                <AvatarFallback className="bg-blue-500 text-white font-semibold">
                  {conversation?.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              {conversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`truncate font-medium ${
                      selectedConversation?.id === conversation.id
                        ? "text-gray-900"
                        : "text-gray-900"
                    }`}
                  >
                    {conversation?.name || "Unknown"}
                  </p>
                  {conversation.isGroup && (
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {conversation.timestamp}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`text-sm truncate ${
                    selectedConversation?.id === conversation.id
                      ? "text-gray-700"
                      : "text-gray-600"
                  }`}
                >
                  {conversation?.lastMessage || ""}
                </p>
                {conversation.unread > 0 && (
                  <Badge
                    variant="default"
                    className="ml-2 rounded-full h-5 min-w-5 px-2 flex items-center justify-center bg-blue-600 text-white text-xs font-semibold shadow-sm flex-shrink-0"
                  >
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* User Control at Bottom */}
      <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="ring-2 ring-gray-200">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${
                  user?.name || user?.email || ""
                }`}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-gray-900">
                  {user?.name || "User"}
                </p>
                {user.role === "admin" && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 transition-colors relative z-10"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 z-50">
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={onShowSettings}
                className="cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem> */}
              {onSwitchToAdmin && (
                <DropdownMenuItem
                  onClick={onSwitchToAdmin}
                  className="cursor-pointer"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="text-red-600 cursor-pointer focus:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="absolute bottom-0 left-0 right-0 top-0">
          <NewChatPanel addConversation={addConversation} open={newChatOpen} onOpenChange={setNewChatOpen} />
        </div>
      </div>
    </>
  );
}
