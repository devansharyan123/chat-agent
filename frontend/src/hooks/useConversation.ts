"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Conversation, Message } from "@/types";

const API_BASE = "/api/chat";

async function fetchHistory(conversationId: string): Promise<Conversation> {
  const res = await fetch(`${API_BASE}/history/${conversationId}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  const data = await res.json();
  if (!data.success) throw new Error(data.errors?.[0] || "Failed to fetch");
  return data.conversation;
}

async function sendMessage(body: { message: string; conversationId: string }) {
  const res = await fetch(`${API_BASE}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

async function createConversation(): Promise<{ conversationId: string }> {
  const res = await fetch(`${API_BASE}/conversation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  const data = await res.json();
  if (!data.success) throw new Error("Failed to create conversation");
  return data;
}

export function useConversationHistory(conversationId: string | null) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => fetchHistory(conversationId!),
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: sendMessage,
  });
}

export function useCreateConversation() {
  return useMutation({
    mutationFn: createConversation,
  });
}
