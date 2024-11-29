import prisma from "@/libs/prisma/prisma";
import { Genre, User } from "@prisma/client";
import { promise } from "zod";
import { TIndexGenreQueryParam } from "@/server/genre/validation/index-genre.validation";
import { TPaginationResponse } from "@/types/meta";
import { convertPaginationMeta } from "@/utils/datatable";

export const createNewGenre = async (data: Genre): Promise<void> => {
  await prisma.genre.create({
    data,
  });
};

export const findAllGenre = async (): Promise<Genre[]> => {
  return await prisma.genre.findMany();
};

export const findGenreById = async (id: string): Promise<Genre | null> => {
  return await prisma.genre.findUnique({
    where: {
      id,
    },
  });
};

export const updateGenreById = async (id: string, data: Genre): Promise<void> => {
  await prisma.genre.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteGenreById = async (id: string): Promise<void> => {
  await prisma.genre.delete({
    where: {
      id,
    },
  });
};

export const genrePagination = async (
  param: TIndexGenreQueryParam,
): Promise<TPaginationResponse<Genre[]>> => {
  const [data, meta] = await prisma.genre
    .paginate({
      where: {
        deletedAt: null,
        ...(param.search
          ? {
              name: {
                contains: param.search,
              },
            }
          : {}),
        ...(param.created_at
          ? {
              createdAt: {
                ...(param.created_at[0] ? { gte: new Date(param.created_at[0]) } : {}),
                ...(param.created_at[1] ? { lte: new Date(param.created_at[1]) } : {}),
              },
            }
          : {}),
      },
      orderBy: {
        ...(param.sort && param.order
          ? {
              [param.sort]: param.order,
            }
          : {
              createdAt: "asc",
            }),
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
