"use server";

import {
  createNewGenre,
  deleteGenreById,
  findGenreById,
  genrePagination,
  updateGenreById,
} from "@/server/genre/repositories/genre.repository";
import { serverCheckPermission } from "@/utils/permission";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import NotFoundException from "../../../errors/NotFoundException";
import {
  createGenreSchema,
  TCreateOrUpdateGenreValidation,
} from "@/server/genre/validation/genre.validation";
import { validate } from "@/utils/zod-validate";
import { Genre } from "@prisma/client";
import { userPagination } from "@/server/user/repositories/user.repository";
import { TIndexGenreQueryParam } from "@/server/genre/validation/index-genre.validation";

export const createGenreAction = async (data: TCreateOrUpdateGenreValidation) => {
  await serverCheckPermission([PERMISSIONS.GENRE_CREATE]);

  await validate(createGenreSchema, data);

  await createNewGenre({
    name: data.name,
  } as Genre);
};

export const getGenresAction = async (param: TIndexGenreQueryParam) => {
  await serverCheckPermission([PERMISSIONS.GENRE_READ]);

  return await genrePagination(param);
};

export const getGenreAction = async (from?: string) => {
  await serverCheckPermission([PERMISSIONS.GENRE_DETAIL]);

  if (!from) return undefined;
  const genre = await findGenreById(from);

  if (!genre) {
    throw new NotFoundException("Genre tidak ditemukan");
  }

  return genre;
};

export const updateGenreAction = async ({
  value,
  id,
}: {
  value: TCreateOrUpdateGenreValidation;
  id: string;
}) => {
  await serverCheckPermission([PERMISSIONS.GENRE_UPDATE]);

  await validate(createGenreSchema, value);

  await updateGenreById(id, {
    name: value.name,
  } as Genre);
};

export const deleteGenreAction = async (from: string) => {
  await serverCheckPermission([PERMISSIONS.GENRE_DELETE]);

  await deleteGenreById(from);
};
