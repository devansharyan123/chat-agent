import { z } from "zod/v4";

export const sendMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be 2000 characters or less")
    .refine((val) => val.trim().length > 0, "Message cannot be only whitespace"),
  conversationId: z.string().uuid("Invalid conversation ID"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
