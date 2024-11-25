import { z } from "zod";

export const createOrUpdateStudioSchema = z.object({
  name: z.string().min(3).max(50),
  capacity: z.number().min(1).max(200),
  facilityAdded: z.array(z.string()).optional(),
  facilityRemoved: z.array(z.string()).optional(),
});

export type TCreateOrUpdateStudioValidation = z.infer<typeof createOrUpdateStudioSchema>;
