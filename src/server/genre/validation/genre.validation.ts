import { z } from "zod";

export const createGenreSchema = z.object({
  name: z.string().min(3).max(50),
});

export type TCreateOrUpdateGenreValidation = z.infer<typeof createGenreSchema>;
