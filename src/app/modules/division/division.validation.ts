import * as z from "zod";

export const createDivisionZodSchema = z
  .object({
    name: z
      .string({ error: "Name must be a string" })
      .min(3, {
        message: "Name must be at least 3 characters long",
      })
      .max(50, {
        message: "Name must be at most 50 characters long",
      }),

    thumbnail: z.string({ error: "Thumbnail must be a string" }).optional(),

    description: z.string({ error: "Description must be a string" }).optional(),
  })
  .strict();

export const updateDivisionZodSchema = createDivisionZodSchema.partial();
