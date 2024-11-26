"use server";

import { TIndexScheduleQueryParam } from "@/server/schedule/validations/index-schedule.vaildation";
import {
  createOrUpdateScheduleSchema,
  TCreateOrUpdateScheduleSchema,
} from "@/server/schedule/validations/schedule.validation";
import { TCreateOrUpdateStudioValidation } from "@/server/studio/validations/studio.validation";
import { serverCheckPermission } from "@/utils/permission";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import {
  createFilmSchedule,
  deleteFilmScheduleById,
  getAllFilmSchedules,
  getFilmScheduleById,
  isScheduleExist,
  updateFilmSchedule,
} from "@/server/schedule/repositories/schedule.repository";
import NotFoundException from "../../../errors/NotFoundException";
import { validate } from "@/utils/zod-validate";

export const getSchedulesAction = async (queryParam: TIndexScheduleQueryParam) => {
  await serverCheckPermission([PERMISSIONS.SCHEDULE_READ]);

  return await getAllFilmSchedules(queryParam);
};

export const getScheduleByIdAction = async (id: string) => {
  await serverCheckPermission([PERMISSIONS.SCHEDULE_DETAIL]);

  const schedule = await getFilmScheduleById(id);
  if (!schedule) throw new NotFoundException("Jadwal tidak ditemukan");

  return schedule;
};

export const createScheduleAction = async (data: TCreateOrUpdateScheduleSchema) => {
  await serverCheckPermission([PERMISSIONS.SCHEDULE_CREATE]);

  await validate(createOrUpdateScheduleSchema, data);

  const showTime = new Date(data.startTime);

  if (isNaN(showTime.getTime())) {
    throw new Error("Format waktu tidak valid");
  }

  const scheduleExists = await isScheduleExist(data.filmId, data.studioId, showTime);
  if (scheduleExists) {
    throw new Error("Jadwal untuk film ini sudah ada pada studio dan waktu yang sama");
  }

  return await createFilmSchedule(data.filmId, data.studioId, showTime, data.price);
};

export const deleteScheduleByIdAction = async (id: string) => {
  await serverCheckPermission([PERMISSIONS.SCHEDULE_DELETE]);

  await deleteFilmScheduleById(id);
};

export const updateScheduleByIdAction = async (input: {
  value: TCreateOrUpdateScheduleSchema;
  id: string;
}) => {
  const { value, id } = input;

  await serverCheckPermission([PERMISSIONS.SCHEDULE_UPDATE]);

  await validate(createOrUpdateScheduleSchema, value);

  const showTime = new Date(value.startTime);

  if (isNaN(showTime.getTime())) {
    throw new Error("Format waktu tidak valid");
  }

  const scheduleExists = await isScheduleExist(value.filmId, value.studioId, showTime);
  if (scheduleExists) {
    throw new Error("Jadwal untuk film ini sudah ada pada studio dan waktu yang sama");
  }

  const existingSchedule = await getFilmScheduleById(id);
  if (!existingSchedule) {
    throw new NotFoundException("Jadwal tidak ditemukan");
  }

  return await updateFilmSchedule(id, value.filmId, value.studioId, showTime, value.price);
};
