import { z } from "zod";

export const createOrUpdateFilmSchema = z.object({
  title: z.string().min(3).max(50),
  duration: z.number().min(1).max(500),
  description: z.string(),
  poster: z.string(),
});

export type TCreateOrUpdateFilmValidation = z.infer<typeof createOrUpdateFilmSchema>;
