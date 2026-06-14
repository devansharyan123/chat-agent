"use client";

import { motion } from "framer-motion";
import { MessageCircle, HelpCircle, Truck, CreditCard } from "lucide-react";

const suggestions = [
  {
    text: "What is your return policy?",
    icon: HelpCircle,
  },
  {
    text: "Do you ship internationally?",
    icon: Truck,
  },
  {
    text: "What payment methods do you accept?",
    icon: CreditCard,
  },
];

interface EmptyStateProps {
  onSelectQuestion: (question: string) => void;
}

export function EmptyState({ onSelectQuestion }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
      >
        <MessageCircle className="w-8 h-8 text-primary" />
      </motion.div>

      <h2 className="text-xl font-semibold mb-2">Welcome to Spur Demo Store</h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-8">
        Hi there! I&apos;m your AI support assistant. Ask me anything about our store policies,
        shipping, returns, and more.
      </p>

      <div className="space-y-2 w-full max-w-sm">
        <p className="text-xs text-muted-foreground font-medium text-center mb-3">
          Suggested questions
        </p>
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            onClick={() => onSelectQuestion(suggestion.text)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors text-left text-sm"
          >
            <suggestion.icon className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{suggestion.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
