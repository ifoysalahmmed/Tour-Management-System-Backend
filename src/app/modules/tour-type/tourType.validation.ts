import * as z from "zod";

export const createTourTypeZodSchema = z
  .object({
    name: z
      .string("Name must be a string")
      .min(3, "Name is required and must be at least 3 characters")
      .max(50, "Name must be less than 50 characters"),
  })
  .strict();
