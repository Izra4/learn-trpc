import { TIndexFilmQueryParam } from "@/server/film/validations/index-film.validation";
import { TCreateOrUpdateFilmValidation } from "@/server/film/validations/film.validation";

export const getFilmsAction = async (param: TIndexFilmQueryParam) => {};

export const getFilmAction = async (id: string) => {};

export const createFilmAction = async (data: TCreateOrUpdateFilmValidation) => {};

export const updateFilmAction = async (input: {
  id: string;
  data: TCreateOrUpdateFilmValidation;
}) => {};

export const deleteFilmAction = async (id: string) => {};
