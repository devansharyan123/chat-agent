export const knowledgeBase = {
  storeName: "Spur Demo Store",
  shipping: {
    policy: "We ship to the USA, Canada, UK, Australia, and India.",
    processingTime: "Orders are processed within 1–2 business days.",
    deliveryTime: "Delivery typically takes 3–7 business days depending on the destination.",
  },
  returns: {
    policy: "We offer a 30-day return window from the date of delivery.",
    condition: "Items must be unused and in their original packaging.",
    refundTime: "Refunds are processed within 5 business days after we receive the returned item.",
  },
  support: {
    hours: "Our support team is available Monday–Friday, 9 AM–6 PM IST.",
    responseTime: "We aim to respond to all inquiries within 24 hours during business days.",
  },
  payments: {
    methods: "We accept Visa, Mastercard, UPI, and PayPal.",
    security: "All payments are processed securely. We do not store any payment information.",
  },
} as const;

export function getFormattedKnowledgeBase(): string {
  const kb = knowledgeBase;
  return [
    `Store Name: ${kb.storeName}`,
    "",
    "--- Shipping Policy ---",
    kb.shipping.policy,
    kb.shipping.processingTime,
    kb.shipping.deliveryTime,
    "",
    "--- Return Policy ---",
    kb.returns.policy,
    kb.returns.condition,
    kb.returns.refundTime,
    "",
    "--- Support Hours ---",
    kb.support.hours,
    kb.support.responseTime,
    "",
    "--- Payment Methods ---",
    kb.payments.methods,
    kb.payments.security,
  ].join("\n");
}
