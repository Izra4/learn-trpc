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
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type), {
      message: "Film poster harus berupa file dengan jenis jpg, png, atau jpeg",
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Ukuran file tidak boleh lebih dari 2MB",
    }),
  genreAdded: z.array(z.string()).optional(),
  genreRemoved: z.array(z.string()).optional(),
});

export type TCreateOrUpdateFilmValidation = z.infer<typeof createOrUpdateFilmSchema>;
