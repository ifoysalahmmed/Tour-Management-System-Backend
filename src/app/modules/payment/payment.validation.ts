import * as z from "zod";

import { CurrencyList, PaymentStatus } from "./payment.interface.js";

export const createPaymentZodSchema = z
  .object({
    booking: z.string({
      error: "Booking is required",
    }),
    currency: z
      .enum(Object.values(CurrencyList) as [string, ...string[]], {
        error: "Invalid currency",
      })
      .default(CurrencyList.BDT),
  })
  .strict();

export const validateIPNZodSchema = z.looseObject({
  tran_id: z.string({
    error: "Transaction ID is required",
  }),
  val_id: z.string({
    error: "Validation ID is required",
  }),
});

export const updatePaymentZodSchema = z
  .object({
    transactionId: z
      .string({
        error: "Transaction ID must be a string",
      })
      .optional(),
    paymentMethod: z
      .string({
        error: "Payment method must be a string",
      })
      .optional(),
    paymentGateway: z
      .record(z.string(), z.unknown(), {
        error: "Payment gateway must be an object",
      })
      .optional(),
    invoiceUrl: z
      .url({
        error: "Invoice URL must be a valid URL",
      })
      .optional(),
    paidAt: z.coerce
      .date({
        error: "Paid at must be a valid date",
      })
      .optional(),
    status: z
      .enum(Object.values(PaymentStatus) as [string, ...string[]], {
        error: "Invalid payment status",
      })
      .optional(),
  })
  .strict();
