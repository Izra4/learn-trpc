import { z } from "zod";

export const facilityCreateOrUpdateSchema = z.object({
  name: z
    .string({
      required_error: "Facility Name Wajib Diisi",
      message: "Facility Name harus berupa string",
    })
    .min(1, { message: "Facility Name wajib diisi" })
    .max(255, { message: "Facility Name maksimal 255 karakter" }),
});

export type TFacilityCreateOrUpdateValidation = z.infer<typeof facilityCreateOrUpdateSchema>;
