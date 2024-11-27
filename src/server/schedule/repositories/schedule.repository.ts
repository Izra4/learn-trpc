import prisma from "@/libs/prisma/prisma";
import { FilmSchedule } from "@prisma/client";
import { TPaginationResponse } from "@/types/meta";
import { convertPaginationMeta } from "@/utils/datatable";
import { TIndexScheduleQueryParam } from "@/server/schedule/validations/index-schedule.vaildation";

export const createFilmSchedule = async (
  filmId: string,
  studioId: string,
  showTime: Date,
  price: number,
): Promise<FilmSchedule> => {
  return await prisma.filmSchedule.create({
    data: {
      filmId,
      studioId,
      showTime,
      price,
    },
  });
};

export const getAllFilmSchedules = async (
  param: TIndexScheduleQueryParam,
): Promise<TPaginationResponse<FilmSchedule[]>> => {
  const [data, meta] = await prisma.filmSchedule
    .paginate({
      where: {
        deletedAt: null,
      },
      include: {
        film: true,
        studio: true,
      },
    })
    .withPages({
      limit: param.perPage,
      page: param.page,
    });

  return {
    data,
    meta: convertPaginationMeta(meta, param),
  };
};

export const getFilmScheduleById = async (id: string) => {
  return await prisma.filmSchedule.findUnique({
    where: { id },
    include: {
      film: true,
      studio: true,
    },
  });
};

export const updateFilmSchedule = async (
  id: string,
  filmId?: string,
  studioId?: string,
  showTime?: Date,
  price?: number,
): Promise<FilmSchedule> => {
  return await prisma.filmSchedule.update({
    where: { id },
    data: {
      filmId,
      studioId,
      showTime,
      price,
    },
  });
};

export const deleteFilmScheduleById = async (id: string): Promise<void> => {
  await prisma.filmSchedule.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const isScheduleExist = async (
  filmId: string,
  studioId: string,
  showTime: Date,
): Promise<boolean> => {
  const schedule = await prisma.filmSchedule.findFirst({
    where: {
      filmId,
      studioId,
      showTime,
      deletedAt: null,
    },
  });
  return schedule !== null;
};
