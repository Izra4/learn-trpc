import { z } from "zod";

export const createOrUpdateFacilitySchema = z.object({
  name: z.string().min(3).max(50),
});

export type TCreateOrUpdateFacilityValidation = z.infer<typeof createOrUpdateFacilitySchema>;
