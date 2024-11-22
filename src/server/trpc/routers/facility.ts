import { publicProcedure, router } from "@/server/trpc/router";
import { z } from "zod";
import { createOrUpdateFacilitySchema } from "@/server/facility/validations/facility.validation";
import {
  createFacilityAction,
  deleteFacilityAction,
  getFacilitiesAction,
  getFacilityAction,
  updateFacilityAction,
} from "@/server/facility/actions/facility.action";

export const facilityRouter = router({
  getFacilities: publicProcedure.query(async () => {
    return await getFacilitiesAction();
  }),

  getFacility: publicProcedure
    .input(z.string().optional())
    .query(({ input }) => getFacilityAction(input)),

  createFacility: publicProcedure
    .input(createOrUpdateFacilitySchema)
    .mutation(({ input }) => createFacilityAction(input)),

  updateFacility: publicProcedure
    .input(
      z.object({
        value: createOrUpdateFacilitySchema,
        id: z.string(),
      }),
    )
    .mutation(({ input }) => updateFacilityAction(input)),

  deleteFacility: publicProcedure
    .input(z.string())
    .mutation(({ input }) => deleteFacilityAction(input)),
});
