import z from "zod";

const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be a string" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),

  email: z.email({ message: "Invalid email format" }),

  password: z
    .string({ error: "Password must be a string" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
      message: "Password must contain at least one special character",
    })
    .regex(/\d/, {
      message: "Password must contain at least one number",
    }),

  phone: z
    .string({ error: "Phone number must be a string" })
    .regex(/(?:8801[3-9]\d{8}|01[3-9]\d{8})$/, {
      message:
        "Phone number must be a valid Bangladeshi number (e.g. 8801XXXXXXXXX or 01XXXXXXXXX)",
    })
    .optional(),

  address: z
    .string()
    .max(200, {
      message: "Address must be at most 200 characters long",
    })
    .optional(),
});

export default createUserZodSchema;
