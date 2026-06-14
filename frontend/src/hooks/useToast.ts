"use client";

import { useState, useCallback } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
      // Use sonner toast instead
      import("sonner").then(({ toast: sonnerToast }) => {
        if (variant === "destructive") {
          sonnerToast.error(title, { description });
        } else {
          sonnerToast.success(title, { description });
        }
      });
    },
    []
  );

  return { toast, toasts };
}
