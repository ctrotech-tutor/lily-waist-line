import { z } from "zod";

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  action: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().trim().max(500).optional(),
}).superRefine((data, context) => {
  if (data.action === "REJECT" && !data.reason) {
    context.addIssue({
      code: "custom",
      message: "Provide a clear reason before rejecting this payment proof",
      path: ["reason"],
    });
  }
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
