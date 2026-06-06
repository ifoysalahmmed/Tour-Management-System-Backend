import * as z from "zod";

import { BookingStatus } from "./booking.interface.js";

export const createBookingZodSchema = z
  .object({
    tour: z.string({
      error: "Tour is required",
    }),
    guide: z
      .string({
        error: "Guide must be a string",
      })
      .optional(),
    guestCount: z
      .number({
        error: "Guest count must be a number",
      })
      .int({ error: "Guest count must be a whole number" })
      .min(1, { error: "At least 1 guest is required" }),
    notes: z
      .string({
        error: "Notes must be a string",
      })
      .max(500, { error: "Notes must be less than 500 characters" })
      .optional(),
  })
  .strict();

export const updateBookingZodSchema = z
  .object({
    guide: z
      .string({
        error: "Guide must be a string",
      })
      .optional(),
    guestCount: z
      .number({
        error: "Guest count must be a number",
      })
      .int({ error: "Guest count must be a whole number" })
      .min(1, { error: "At least 1 guest is required" })
      .optional(),
    notes: z
      .string({
        error: "Notes must be a string",
      })
      .max(500, { error: "Notes must be less than 500 characters" })
      .optional(),
    status: z
      .enum(Object.values(BookingStatus) as [string, ...string[]], {
        error: "Invalid booking status",
      })
      .optional(),
  })
  .strict();
