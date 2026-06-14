"use client";

import { Moon, Sun, MessageSquare, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/app/theme-provider";

interface ChatHeaderProps {
  conversationId: string | null;
  messageCount: number;
}

export function ChatHeader({ conversationId, messageCount }: ChatHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="border-b border-border px-4 py-3 flex items-center justify-between bg-background">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h1 className="text-sm font-semibold">AI Support</h1>
        </div>
        {conversationId && (
          <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {conversationId.slice(0, 8)}...
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {messageCount} messages
            </span>
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  );
}
