"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "@/types";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { EmptyState } from "./EmptyState";
import { ChatHeader } from "./ChatHeader";
import { useToast } from "@/hooks/useToast";

const CONVERSATION_KEY = "chat-conversation-id";
const USER_ID_KEY = "chat-user-id";

function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load or create conversation
  useEffect(() => {
    const stored = localStorage.getItem(CONVERSATION_KEY);
    if (stored) {
      setConversationId(stored);
      fetchHistory(stored);
    } else {
      createConversation();
    }
  }, []);

  const createConversation = async () => {
    try {
      const res = await fetch("/api/chat/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": getUserId(),
        },
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(CONVERSATION_KEY, data.conversationId);
        setConversationId(data.conversationId);
        setIsLoading(false);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create conversation. Please refresh.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchHistory = async (convId: string) => {
    try {
      const res = await fetch(`/api/chat/history/${convId}`, {
        headers: {
          "x-user-id": getUserId(),
        },
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.conversation.messages);
      }
    } catch {
      // silent fail - will show empty state
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = useCallback(
    async (content: string) => {
      if (!conversationId || isSending) return;

      // Optimistically add user message
      const tempUserMsg: Message = {
        id: `temp-${Date.now()}`,
        conversationId,
        sender: "USER",
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMsg]);
      setIsSending(true);

      try {
        const res = await fetch("/api/chat/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": getUserId(),
          },
          body: JSON.stringify({ message: content, conversationId }),
        });
        const data = await res.json();

        if (data.success) {
          // Replace temp user message with real one and add AI reply
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
            return [
              ...filtered,
              {
                id: `user-${Date.now()}`,
                conversationId,
                sender: "USER" as const,
                content,
                createdAt: new Date().toISOString(),
              },
              {
                id: `ai-${Date.now()}`,
                conversationId,
                sender: "AI" as const,
                content: data.reply,
                createdAt: new Date().toISOString(),
              },
            ];
          });
        } else {
          // Remove temp message on failure
          setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
          toast({
            title: "Error",
            description: data.errors?.[0] || "Failed to send message.",
            variant: "destructive",
          });
        }
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
        toast({
          title: "Error",
          description: "Network error. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, isSending, toast]
  );

  const handleRetry = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === "USER");
    if (lastUserMsg) {
      // Remove last AI message and retry
      setMessages((prev) => {
        const lastAi = prev.length > 0 && prev[prev.length - 1].sender === "AI" ? prev.pop() : null;
        return prev;
      });
      handleSend(lastUserMsg.content);
    }
  }, [messages, handleSend]);

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      <ChatHeader conversationId={conversationId} messageCount={messages.length} />

      {messages.length === 0 && !isLoading ? (
        <EmptyState onSelectQuestion={handleSend} />
      ) : (
        <MessageList
          messages={messages}
          isLoading={isLoading}
          isSending={isSending}
        />
      )}

      <ChatInput onSend={handleSend} isSending={isSending} />
    </div>
  );
}
