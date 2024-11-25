import { z } from "zod";

export const createOrUpdateStudioSchema = z.object({
  name: z.string().min(3).max(50),
  capacity: z.number().min(1).max(200),
  facility: z.array(z.string()),
});

export type TCreateOrUpdateStudioValidation = z.infer<typeof createOrUpdateStudioSchema>;
