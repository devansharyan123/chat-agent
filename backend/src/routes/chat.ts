import { Router, Request, Response } from "express";
import { prisma } from "../lib/db/prisma";
import { generateReply } from "../lib/ai/generateReply";
import { sendMessageSchema } from "../lib/validations/chat";

const router = Router();

// POST /api/chat/message
router.post("/message", async (req: Request, res: Response) => {
  try {
    const parsed = sendMessageSchema.safeParse(req.body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => issue.message);
      res.status(400).json({ success: false, errors });
      return;
    }

    const { message, conversationId } = parsed.data;

    // Verify conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      res.status(404).json({
        success: false,
        errors: ["Conversation not found"],
      });
      return;
    }

    // 1. Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        sender: "USER",
        content: message,
      },
    });

    // 2. Fetch recent history for context
    const recentMessages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    const history = recentMessages.map((msg) => ({
      sender: msg.sender as "USER" | "AI",
      content: msg.content,
    }));

    // 3. Call AI
    let aiReply: string;
    try {
      aiReply = await generateReply(history, message);
    } catch (aiError) {
      // If AI fails, still return the user message was saved
      console.error("AI generation error:", aiError);

      const errorMessage =
        aiError instanceof Error
          ? getFriendlyErrorMessage(aiError)
          : "Sorry, I'm having trouble responding right now. Please try again in a moment.";

      res.status(200).json({
        reply: errorMessage,
        conversationId,
        success: true,
        fromCache: true,
      });
      return;
    }

    // 4. Save AI response
    const aiMessage = await prisma.message.create({
      data: {
        conversationId,
        sender: "AI",
        content: aiReply,
      },
    });

    res.status(200).json({
      reply: aiReply,
      conversationId,
      success: true,
    });
  } catch (error) {
    console.error("Unexpected error in chat message:", error);
    res.status(500).json({
      success: false,
      errors: ["An unexpected error occurred. Please try again."],
    });
  }
});

// GET /api/chat/history/:conversationId
router.get("/history/:conversationId", async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      res.status(404).json({ success: false, errors: ["Conversation not found"] });
      return;
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({
      success: false,
      errors: ["Failed to fetch conversation history."],
    });
  }
});

// POST /api/chat/conversation
router.post("/conversation", async (_req: Request, res: Response) => {
  try {
    const conversation = await prisma.conversation.create({
      data: {},
    });

    res.status(201).json({
      success: true,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      success: false,
      errors: ["Failed to create conversation."],
    });
  }
});

function getFriendlyErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes("api key") || message.includes("unauthorized") || message.includes("401")) {
    return "Sorry, there's a configuration issue with the AI service. Please contact support.";
  }
  if (message.includes("rate limit") || message.includes("429")) {
    return "Sorry, we're receiving too many requests. Please wait a moment and try again.";
  }
  if (message.includes("timeout") || message.includes("timed out")) {
    return "Sorry, the request timed out. Please try again.";
  }
  if (message.includes("network") || message.includes("econnrefused") || message.includes("econnreset")) {
    return "Sorry, there's a network issue. Please check your connection and try again.";
  }

  return "Sorry, I'm having trouble responding right now. Please try again in a moment.";
}

export default router;
