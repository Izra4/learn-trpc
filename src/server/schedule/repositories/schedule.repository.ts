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

type PriceCategory = "small" | "medium" | "large" | "extra_large" | "default";

const priceMapping: Record<PriceCategory, { price?: { gte?: number; lte?: number } }> = {
  small: { price: { lte: 100 } },
  medium: { price: { gte: 100, lte: 200 } },
  large: { price: { gte: 200, lte: 500 } },
  extra_large: { price: { gte: 500 } },
  default: {},
};

export const getAllFilmSchedules = async (
  param: TIndexScheduleQueryParam,
): Promise<TPaginationResponse<FilmSchedule[]>> => {
  const priceFilter =
    param.price && priceMapping[param.price as PriceCategory]
      ? priceMapping[param.price as PriceCategory].price
      : priceMapping["default"].price;

  const [data, meta] = await prisma.filmSchedule
    .paginate({
      where: {
        deletedAt: null,
        ...(param.created_at
          ? {
              createdAt: {
                ...(param.created_at[0] ? { gte: new Date(param.created_at[0]) } : {}),
                ...(param.created_at[1] ? { lte: new Date(param.created_at[1]) } : {}),
              },
            }
          : {}),
        ...(param.search
          ? {
              name: {
                contains: param.search,
              },
            }
          : {}),
        ...(param.price ? { price: priceFilter } : {}),
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
