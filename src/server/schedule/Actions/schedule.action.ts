import { TIndexScheduleQueryParam } from "@/server/schedule/validations/index-schedule.vaildation";
import { TCreateOrUpdateScheduleSchema } from "@/server/schedule/validations/schedule.validation";
import { TCreateOrUpdateStudioValidation } from "@/server/studio/validations/studio.validation";

export const getSchedulesAction = async (queryParam: TIndexScheduleQueryParam) => {};

export const getScheduleByIdAction = async (id: string) => {};

export const createScheduleAction = async (data: TCreateOrUpdateScheduleSchema) => {};

export const deleteScheduleByIdAction = async (id: string) => {};

export const updateScheduleByIdAction = async (input: {
  value: TCreateOrUpdateStudioValidation;
  id: string;
}) => {};
