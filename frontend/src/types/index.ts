export type Sender = "USER" | "AI";

export interface Message {
  id: string;
  conversationId: string;
  sender: Sender;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}
