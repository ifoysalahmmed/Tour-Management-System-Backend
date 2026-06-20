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

export const forgotPasswordZodSchema = z.object({
  email: z.email({
    error: "Invalid email format",
  }),
});

export const resetPasswordZodSchema = z.object({
  password: z
    .string({
      error: "Password must be a string",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
      message: "Password must contain at least one special character",
    })
    .regex(/\d/, {
      message: "Password must contain at least one number",
    }),
});
