import { z } from "zod";

export const createOrUpdateFilmSchema = z.object({
  title: z
    .string({
      required_error: "Film Title Wajib Diisi",
      message: "Film Title harus berupa string",
    })
    .min(1, { message: "Film Title wajib diisi" })
    .max(255, { message: "Film Title maksimal 255 karakter" }),
  duration: z
    .number({ required_error: "Duration Wajib Diisi", message: "Duration harus berupa angka" })
    .min(1, { message: "Duration wajib diisi" }),
  description: z.string({
    required_error: "Description Wajib Diisi",
    message: "Description harus berupa string",
  }),
  poster: z
    .string({ required_error: "Poster Wajib Diisi", message: "Poster harus berupa string" })
    .min(1, { message: "Poster wajib diisi" }),
  genreAdded: z.array(z.string()).optional(),
  genreRemoved: z.array(z.string()).optional(),
});

export type TCreateOrUpdateFilmValidation = z.infer<typeof createOrUpdateFilmSchema>;
