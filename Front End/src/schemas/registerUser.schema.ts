import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required!")
    .min(3, "Username must be at least 3 characters.")
    .max(16, "Username must be at most 16 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscore allowed."),

  email: z
    .string()
    .nonempty("Please enter your email!")
    .email("Invalid email."),

  password: z
    .string()
    .nonempty("Please enter the password!")
    .min(6, "Password must be at least 6 characters.")
    .max(16, "Password must be at most 16 characters."),
});

export type RegisterForm = z.infer<typeof registerSchema>;

