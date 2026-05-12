import * as z from "zod";

export const createTourZodSchema = z
  .object({
    title: z
      .string("Title must be a string")
      .min(3, "Title is required and must be at least 3 characters long")
      .max(100, "Title must be less than 100 characters long"),

    description: z.string("Description must be a string").optional(),

    images: z.array(z.string("Each image must be a string")).optional(),

    location: z.string("Location must be a string").optional(),

    costFrom: z.number("Cost from must be a number").optional(),

    startDate: z.coerce
      .date({ message: "Start date must be a valid date" })
      .optional(),

    endDate: z.coerce
      .date({ message: "End date must be a valid date" })
      .optional(),

    departureLocation: z
      .string("Departure location must be a string")
      .max(150, "Departure location must be less than 150 characters long")
      .optional(),

    arrivalLocation: z
      .string("Arrival location must be a string")
      .max(150, "Arrival location must be less than 150 characters long")
      .optional(),

    included: z
      .array(z.string("Each included item must be a string"))
      .optional(),

    excluded: z
      .array(z.string("Each excluded item must be a string"))
      .optional(),

    amenities: z.array(z.string("Each amenity must be a string")).optional(),

    tourPlan: z
      .array(z.string("Each tour plan item must be a string"))
      .optional(),

    maxGuest: z.number("Max guest must be a number").optional(),

    minAge: z.number("Min age must be a number").optional(),

    division: z.string("Division must be a string"),

    tourType: z.string("Tour type must be a string"),
  })
  .strict();

export const updateTourZodSchema = createTourZodSchema.partial();
