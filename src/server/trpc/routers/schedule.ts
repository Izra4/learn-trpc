import { publicProcedure, router } from "@/server/trpc/router";
import { TIndexScheduleQueryParam } from "@/server/schedule/validations/index-schedule.vaildation";
import { z } from "zod";
import {
  createScheduleAction,
  deleteScheduleByIdAction,
  getScheduleByIdAction,
  getSchedulesAction,
  updateScheduleByIdAction,
} from "@/server/schedule/Actions/schedule.action";
import { createOrUpdateScheduleSchema } from "@/server/schedule/validations/schedule.validation";
import { createOrUpdateStudioSchema } from "@/server/studio/validations/studio.validation";

export const scheduleRouter = router({
  getSchedules: publicProcedure
    .input(z.custom<TIndexScheduleQueryParam>())
    .query(({ input }) => getSchedulesAction(input)),

  getSchedule: publicProcedure
    .input(z.string({ required_error: "id is required" }))
    .query(({ input }) => getScheduleByIdAction(input)),

  createSchedule: publicProcedure
    .input(createOrUpdateScheduleSchema)
    .mutation(({ input }) => createScheduleAction(input)),

  updateSchedule: publicProcedure
    .input(
      z.object({
        value: createOrUpdateStudioSchema,
        id: z.string(),
      }),
    )
    .mutation(({ input }) => updateScheduleByIdAction(input)),

  deleteSchedule: publicProcedure
    .input(z.string())
    .mutation(({ input }) => deleteScheduleByIdAction(input)),
});
