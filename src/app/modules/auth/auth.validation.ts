import * as z from "zod";

export const loginZodSchema = z
  .object({
    email: z.email({
      error: "Invalid email format",
    }),
    password: z
      .string({
        error: "Password must be a string",
      })
      .min(1, {
        error: "Password is required",
      }),
  })
  .strict();
