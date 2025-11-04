import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Phone, Video, MoreVertical, Send, Paperclip, Smile, Image } from 'lucide-react';
import type { Conversation, Message } from './ChatInterface';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatWindow({ conversation, messages, onSendMessage }: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback>{conversation.name[0]}</AvatarFallback>
              </Avatar>
              {conversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <p>{conversation.name}</p>
              <p className="text-sm text-gray-500">
                {conversation.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                <DropdownMenuItem>Search in Conversation</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete Conversation</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[70%] ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {!message.isOwn && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  {!message.isOwn && conversation.isGroup && (
                    <p className="text-xs text-gray-600 mb-1 ml-1">{message.senderName}</p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.isOwn
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${message.isOwn ? 'text-right' : 'text-left'} ml-1`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Image className="w-5 h-5 text-gray-500" />
            </Button>
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Smile className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
          <Button type="submit" size="icon" className="rounded-full h-10 w-10" disabled={!messageInput.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
