import * as z from "zod";

export const createTourZodSchema = z
  .object({
    title: z
      .string({
        error: "Title must be a string",
      })
      .min(3, {
        error: "Title is required and must be at least 3 characters long",
      })
      .max(100, {
        error: "Title must be less than 100 characters long",
      }),
    description: z
      .string({
        error: "Description must be a string",
      })
      .optional(),
    images: z
      .array(
        z.string({
          error: "Each image must be a string",
        }),
      )
      .optional(),
    location: z.string({
      error: "Location must be a string",
    }),
    costFrom: z.number({
      error: "Cost from must be a number",
    }),
    startDate: z.coerce.date({
      error: "Start date must be a valid date",
    }),
    endDate: z.coerce.date({
      error: "End date must be a valid date",
    }),
    departureLocation: z
      .string({
        error: "Departure location must be a string",
      })
      .max(150, {
        error: "Departure location must be less than 150 characters long",
      })
      .optional(),
    arrivalLocation: z
      .string({
        error: "Arrival location must be a string",
      })
      .max(150, {
        error: "Arrival location must be less than 150 characters long",
      })
      .optional(),
    included: z
      .array(
        z.string({
          error: "Each included item must be a string",
        }),
      )
      .optional(),
    excluded: z
      .array(
        z.string({
          error: "Each excluded item must be a string",
        }),
      )
      .optional(),
    amenities: z
      .array(
        z.string({
          error: "Each amenity must be a string",
        }),
      )
      .optional(),
    tourPlan: z
      .array(
        z.string({
          error: "Each tour plan item must be a string",
        }),
      )
      .optional(),
    maxGuest: z
      .number({
        error: "Max guest must be a number",
      })
      .optional(),
    minAge: z
      .number({
        error: "Min age must be a number",
      })
      .optional(),
    division: z.string({
      error: "Division must be a string",
    }),
    tourType: z.string({
      error: "Tour type must be a string",
    }),
  })
  .strict();

export const updateTourZodSchema = createTourZodSchema.partial();
