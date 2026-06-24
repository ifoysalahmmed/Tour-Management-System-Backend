import * as z from "zod";

export const sendOTPZodSchema = z
  .object({
    email: z.email({
      error: "Invalid email format",
    }),
  })
  .strict();

export const verifyOTPZodSchema = z
  .object({
    email: z.email({
      error: "Invalid email format",
    }),
    otp: z.string().regex(/^[0-9]+$/),
  })
  .strict();
