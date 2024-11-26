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
} from "@/server/film/repositories/film.repository";
import NotFoundException from "../../../errors/NotFoundException";
import { validate } from "@/utils/zod-validate";

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

  // await createNewFilm(data.title, data.duration, data.description, data.poster, data.genreAdded);
};

export const updateFilmAction = async (input: {
  id: string;
  data: TCreateOrUpdateFilmValidation;
}) => {};

export const deleteFilmAction = async (id: string) => {
  await serverCheckPermission([PERMISSIONS.FILM_DELETE]);

  await deleteFilmById(id);
};
