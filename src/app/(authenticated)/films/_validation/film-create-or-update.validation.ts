import { title } from "process";
import { z } from "zod";

export const filmCreateOrUpdateSchema = z.object({
  title: z
    .string({
      required_error: "Film Title Wajib Diisi",
      message: "Film Title harus berupa string",
    })
    .min(1, { message: "Film Title wajib diisi" })
    .max(255, { message: "Film Title maksimal 255 karakter" }),
  duration: z
    .number({
      required_error: "Duration Wajib Diisi",
      message: "Duration harus berupa angka",
    })
    .min(1, { message: "Duration wajib diisi" }),
  poster: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type), {
      message: "Film poster harus berupa file dengan jenis jpg, png, atau jpeg",
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Film poster maksimal 2 MB",
    }),
  description: z.string().min(1, { message: "Film description wajib diisi" }),
});

export type TFilmCreateOrUpdateValidation = z.infer<typeof filmCreateOrUpdateSchema>;
