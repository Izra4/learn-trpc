"use server";

import { TIndexFilmQueryParam } from "@/server/film/validations/index-film.validation";
import {
  createOrUpdateFilmSchema,
  TCreateOrUpdateFilmValidation,
} from "@/server/film/validations/film.validation";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { serverCheckPermission } from "@/utils/permission";
import {
  createNewFilm,
  deleteFilmById,
  filmPagination,
  findFilmByIdWithGenres,
  updateFilmById,
} from "@/server/film/repositories/film.repository";
import NotFoundException from "../../../errors/NotFoundException";
import { validate } from "@/utils/zod-validate";
import { uploadFileToServer } from "@/utils/upload-file";
import * as fs from "node:fs";
import path from "path";

export const getFilmsAction = async (param: TIndexFilmQueryParam) => {
  await serverCheckPermission([PERMISSIONS.FILM_READ]);

  return await filmPagination(param);
};

export const getFilmAction = async (id: string) => {
  await serverCheckPermission([PERMISSIONS.FILM_DETAIL]);

  const film = await findFilmByIdWithGenres(id);

  if (!film) throw new NotFoundException("Film tidak ditemukan");

  return film;
};

export const createFilmAction = async (data: TCreateOrUpdateFilmValidation) => {
  await serverCheckPermission([PERMISSIONS.FILM_CREATE]);

  await validate(createOrUpdateFilmSchema, data);
  const uploadedFilePath = await uploadFileToServer(data.poster);

  await createNewFilm(
    data.title,
    data.duration,
    data.description,
    uploadedFilePath,
    data.genreAdded,
  );
};

export const updateFilmAction = async (input: {
  id: string;
  data: TCreateOrUpdateFilmValidation;
}) => {
  const { id, data } = input;

  await serverCheckPermission([PERMISSIONS.FILM_UPDATE]);

  const film = await findFilmByIdWithGenres(id);
  if (!film) {
    throw new NotFoundException("Film tidak ditemukan");
  }

  const oldFilePath = film.poster;

  if (oldFilePath) {
    const uploadDir = path.resolve(__dirname, "../../..", "uploads");
    const absoluteOldFilePath = path.join(uploadDir, path.basename(oldFilePath));

    if (fs.existsSync(absoluteOldFilePath)) {
      fs.unlinkSync(absoluteOldFilePath);
    }
  }

  const uploadedFilePath = await uploadFileToServer(data.poster);

  await updateFilmById(
    id,
    data.title,
    data.duration,
    data.description,
    uploadedFilePath,
    data.genreAdded,
    data.genreRemoved,
  );
};

export const deleteFilmAction = async (id: string) => {
  await serverCheckPermission([PERMISSIONS.FILM_DELETE]);

  const film = await findFilmByIdWithGenres(id);
  if (!film) {
    throw new NotFoundException("Film tidak ditemukan");
  }
  const filePath = film.poster;
  if (filePath) {
    const uploadDir = path.resolve(__dirname, "../../..", "uploads");
    const absoluteFilePath = path.join(uploadDir, path.basename(filePath));
    if (fs.existsSync(absoluteFilePath)) {
      fs.unlinkSync(absoluteFilePath);
    }
  }

  await deleteFilmById(id);
};
