import { publicProcedure, router } from "@/server/trpc/router";
import { TIndexStudioQueryParam } from "@/server/studio/validations/index-studio.validation";
import { z } from "zod";
import { createOrUpdateStudioSchema } from "@/server/studio/validations/studio.validation";
import {
  createStudioAction,
  deleteStudioAction,
  getStudioAction,
  getStudiosAction,
  updateStudioAction,
} from "@/server/studio/actions/studio.action";

export const studioRouter = router({
  getStudios: publicProcedure
    .input(z.custom<TIndexStudioQueryParam>())
    .query(({ input }) => getStudiosAction(input)),

  getStudio: publicProcedure
    .input(z.string().optional())
    .query(({ input }) => getStudioAction(input)),

  updateStudio: publicProcedure
    .input(
      z.object({
        value: createOrUpdateStudioSchema,
        id: z.string(),
      }),
    )
    .mutation(({ input }) => updateStudioAction(input)),

  deleteStudio: publicProcedure
    .input(z.string().optional())
    .mutation(({ input }) => deleteStudioAction(input)),

  createStudio: publicProcedure
    .input(createOrUpdateStudioSchema)
    .mutation(({ input }) => createStudioAction(input)),
});
