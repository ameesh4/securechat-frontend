import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, MoreVertical, Phone, Video } from "lucide-react";
import type { Conversation, Message } from "./ChatInterface";
import React from "react";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatWindow({
  conversation,
  messages,
  onSendMessage,
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-blue-100">
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback className="bg-blue-500 text-white font-semibold text-lg">
                  {conversation?.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              {conversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-base">
                {conversation?.name || "Unknown"}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    conversation.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span>{conversation.isOnline ? "Online" : "Offline"}</span>
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Avatar className="w-16 h-16 ring-2 ring-blue-200">
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback className="bg-blue-500 text-white text-2xl font-semibold">
                  {conversation?.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {conversation?.name || "Unknown"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {conversation.isOnline
                ? "This is the beginning of your conversation"
                : "Start a conversation"}
            </p>
            <p className="text-xs text-gray-400">
              Messages are end-to-end encrypted
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  message.isOwn ? "justify-end" : "justify-start"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`flex gap-2 max-w-[70%] ${
                    message.isOwn ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {!message.isOwn && (
                    <Avatar className="w-8 h-8 ring-1 ring-gray-200">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {message?.senderName?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    {!message.isOwn && conversation.isGroup && (
                      <p className="text-xs text-gray-600 mb-1 ml-1 font-medium">
                        {message?.senderName || "Unknown"}
                      </p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 shadow-sm transition-all hover:shadow-md ${
                        message.isOwn
                          ? "bg-blue-600 text-white rounded-tr-sm"
                          : "bg-white text-gray-900 rounded-tl-sm border border-gray-200 shadow-sm"
                      }`}
                    >
                      <p
                        className={`${
                          message.isOwn ? "text-white" : "text-gray-900"
                        } leading-relaxed text-[15px]`}
                      >
                        {message?.content || ""}
                      </p>
                    </div>
                    <p
                      className={`text-xs text-gray-500 mt-1.5 ${
                        message.isOwn ? "text-right mr-1" : "text-left ml-1"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white shadow-lg">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 max-w-4xl mx-auto"
        >
          <div className="flex-1 bg-gray-50 rounded-2xl px-5 py-3 flex items-center gap-2 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white transition-all shadow-sm">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-gray-400 text-[15px]"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="rounded-full h-11 w-11 bg-blue-600 hover:bg-blue-700 text-black shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            disabled={!messageInput.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
