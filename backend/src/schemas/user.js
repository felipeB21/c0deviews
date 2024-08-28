import { z } from "zod";

export const userRegistration = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

export const userLogin = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(20),
});
