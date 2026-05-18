import * as z from "zod";

export const createTourTypeZodSchema = z
  .object({
    name: z
      .string({
        error: "Name must be a string",
      })
      .min(3, {
        error: "Name is required and must be at least 3 characters",
      })
      .max(50, {
        error: "Name must be less than 50 characters",
      }),
  })
  .strict();

export const updateTourTypeZodSchema = createTourTypeZodSchema.partial();
