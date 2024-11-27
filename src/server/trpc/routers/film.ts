import { publicProcedure, router } from "@/server/trpc/router";
import {
  createFilmAction,
  deleteFilmAction,
  getFilmAction,
  getFilmsAction,
  updateFilmAction,
} from "@/server/film/actions/film.action";
import { z } from "zod";
import { TIndexFilmQueryParam } from "@/server/film/validations/index-film.validation";
import { createOrUpdateFilmSchema } from "@/server/film/validations/film.validation";

export const filmRouter = router({
  getFilms: publicProcedure
    .input(z.custom<TIndexFilmQueryParam>())
    .query(({ input }) => getFilmsAction(input)),

  getFilm: publicProcedure.input(z.string()).query(({ input }) => getFilmAction(input)),

  updateFilm: publicProcedure
    .input(
      z.object({
        data: createOrUpdateFilmSchema,
        id: z.string(),
      }),
    )
    .mutation(({ input }) => updateFilmAction(input)),

  deleteFilm: publicProcedure.input(z.string()).mutation(({ input }) => deleteFilmAction(input)),

  createFilm: publicProcedure
    .input(createOrUpdateFilmSchema)
    .mutation(({ input }) => createFilmAction(input)),
});
