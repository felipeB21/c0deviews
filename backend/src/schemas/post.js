import { z } from "zod";

export const postValidation = z.object({
  title: z.string().min(3).max(50),
  body: z.string().min(20).max(400),
});

export const messageValidation = z.object({
  comment: z.string().min(1).max(400),
});
