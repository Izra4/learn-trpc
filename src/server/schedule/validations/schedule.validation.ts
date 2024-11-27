import { z } from "zod";

export const createOrUpdateScheduleSchema = z.object({
  studioId: z.string({
    required_error: "Studio id wajib diisi",
    message: "Studio id harus berupa string",
  }),
  filmId: z.string({
    required_error: "Film id wajib diisi",
    message: "Film id harus berupa string",
  }),
  startTime: z.string({
    required_error: "Start time wajib diisi",
  }),
  price: z.number({
    required_error: "Price wajib diisi",
    message: "Price harus berupa angka",
  }),
});

export type TCreateOrUpdateScheduleSchema = z.infer<typeof createOrUpdateScheduleSchema>;
