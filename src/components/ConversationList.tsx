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
import type { Conversation } from "./ChatInterface";
import React from "react";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  user: { id: string; name: string; email: string; role: "user" | "admin" };
  onLogout: () => void;
  onSwitchToAdmin?: () => void;
  onShowProfile: () => void;
  onShowSettings: () => void;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  user,
  onLogout,
  onSwitchToAdmin,
  onShowProfile,
  onShowSettings,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header with Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200">
        <Button className="w-full" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
              selectedConversation?.id === conversation.id
                ? "bg-blue-50 hover:bg-blue-50"
                : ""
            }`}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback>{conversation.name[0]}</AvatarFallback>
              </Avatar>
              {conversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <p className="truncate">{conversation.name}</p>
                  {conversation.isGroup && (
                    <MessageSquare className="w-3 h-3 text-gray-400" />
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {conversation.timestamp}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage}
                </p>
                {conversation.unread > 0 && (
                  <Badge
                    variant="default"
                    className="ml-2 rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center"
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
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?w=150" />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate">{user.name}</p>
                {user.role === "admin" && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onShowProfile}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShowSettings}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              {onSwitchToAdmin && (
                <DropdownMenuItem onClick={onSwitchToAdmin}>
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
