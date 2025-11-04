import { create } from "zustand";

export type Conversation = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isGroup: boolean;
  isOnline?: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
};

interface ChatState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Record<string, Message[]>;
  setConversations: (conversations: Conversation[]) => void;
  setSelectedConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Record<string, Message[]>) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateConversation: (
    conversationId: string,
    updates: Partial<Conversation>
  ) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  selectedConversation: null,
  messages: {},
  setConversations: (conversations) => set({ conversations }),
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    })),
  updateConversation: (conversationId, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, ...updates } : conv
      ),
    })),
}));
