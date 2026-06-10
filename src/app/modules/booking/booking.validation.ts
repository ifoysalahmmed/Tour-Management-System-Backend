import * as z from "zod";

import { BookingStatus } from "./booking.interface.js";

export const createBookingZodSchema = z
  .object({
    tour: z.string({
      error: "Tour is required",
    }),
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

export const updateBookingStatusZodSchema = z
  .object({
    bookingStatus: z.enum(Object.values(BookingStatus) as [string, ...string[]], {
      error: "Invalid booking status",
    }),
  })
  .strict();

export const assignGuideZodSchema = z
  .object({
    guide: z.string({
      error: "Guide is required",
    }),
  })
  .strict();
