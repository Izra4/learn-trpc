import { z } from "zod";

export const studioCreateOrUpdateSchema = z.object({
  name: z
    .string({
      required_error: "Studio Name Wajib Diisi",
      message: "Studio Name harus berupa string",
    })
    .min(1, { message: "Studio Name wajib diisi" })
    .max(255, { message: "Studio Name maksimal 255 karakter" }),
  capacity: z
    .number({
      required_error: "Capacity Wajib Diisi",
      message: "Capacity harus berupa angka",
    })
    .min(1, { message: "Capacity wajib diisi" }),
  facilityIds: z
    .array(z.string({ message: "Facility id harus berupa string" }))
    .nonempty({ message: "Minimal satu facility harus dipilih" }),
});

export type TStudioCreateOrUpdateValidation = z.infer<typeof studioCreateOrUpdateSchema>;
