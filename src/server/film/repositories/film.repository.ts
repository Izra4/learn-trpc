import { TIndexFilmQueryParam } from "@/server/film/validations/index-film.validation";
import { FilmWithGenre } from "@/libs/prisma/types/film-with-genre";
import { TPaginationResponse } from "@/types/meta";
import prisma from "@/libs/prisma/prisma";
import { convertPaginationMeta } from "@/utils/datatable";
import { PrismaClient } from "@prisma/client/extension";

type durationCategory = "short" | "medium" | "extra_long" | "long" | "default";

const durationMapping: Record<durationCategory, { duration?: { gte?: number; lte?: number } }> = {
  default: {},
  short: { duration: { lte: 10 } },
  medium: { duration: { gte: 10, lte: 30 } },
  long: { duration: { gte: 30, lte: 60 } },
  extra_long: { duration: { gte: 60 } },
};

export const filmPagination = async (
  param: TIndexFilmQueryParam,
): Promise<TPaginationResponse<FilmWithGenre[]>> => {
  const durationFilter =
    param.duration && durationMapping[param.duration as durationCategory]
      ? durationMapping[param.duration as durationCategory].duration
      : durationMapping["default"].duration;

  const [data, meta] = await prisma.film
    .paginate({
      include: {
        genres: {
          include: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
      },
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
        ...(durationFilter ? { duration: durationFilter } : {}),
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

export const createNewFilm = async (
  title: string,
  duration: number,
  description: string,
  poster: string,
  genres?: string[],
) => {
  return await prisma.$transaction(async (tx) => {
    const film = await tx.film.create({
      data: {
        title,
        duration,
        description,
        poster,
      },
    });

    if (genres && genres.length > 0) {
      const data = genres.map((genreId) => ({
        filmId: film.id,
        genreId: genreId,
      }));

      await tx.filmGenre.createMany({
        data,
      });
    }
  });
};

export const findFilmByIdWithGenres = async (id: string) => {
  return (
    (await prisma.film.findUnique({
      where: {
        id,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    })) ?? undefined
  );
};

export const updateFilmById = async (
  id: string,
  title?: string,
  duration?: number,
  description?: string,
  poster?: string,
  genresAdded?: string[],
  genresRemoved?: string[],
) => {
  return await prisma.$transaction(async (tx) => {
    const updatedFilm = await tx.film.update({
      where: {
        id,
      },
      data: {
        ...(title && { title }),
        ...(duration && { duration }),
        ...(description && { description }),
        ...(poster && { poster }),
      },
    });

    if (genresAdded && genresAdded.length > 0) {
      await tx.filmGenre.createMany({
        data: genresAdded.map((genreId) => ({
          filmId: id,
          genreId,
        })),
      });
    }

    if (genresRemoved && genresRemoved.length > 0) {
      await tx.filmGenre.deleteMany({
        where: {
          filmId: id,
          genreId: {
            in: genresRemoved,
          },
        },
      });
    }

    return updatedFilm;
  });
};

export const deleteFilmById = async (id: string) => {
  await prisma.film.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
