import OpenAI from "openai";
import { getSystemPrompt } from "./systemPrompt";

const MAX_HISTORY_MESSAGES = 10;

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

interface HistoryMessage {
  sender: "USER" | "AI";
  content: string;
}

export async function generateReply(
  history: HistoryMessage[],
  userMessage: string
): Promise<string> {
  const systemPrompt = getSystemPrompt();

  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...recentHistory.map((msg) => ({
      role: msg.sender === "USER" ? "user" as const : "assistant" as const,
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });

  const reply = response.choices[0]?.message?.content;

  if (!reply) {
    throw new Error("AI returned an empty response");
  }

  return reply.trim();
}
