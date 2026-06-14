import { z } from "zod/v4";

export const sendMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required — please type something before sending.")
    .max(2000, `Message is too long. Please keep it under 2000 characters.`)
    .refine((val) => val.trim().length > 0, "Message cannot be only whitespace — please write a real message."),
  conversationId: z.string().uuid("Invalid conversation ID. Please start a new conversation."),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
