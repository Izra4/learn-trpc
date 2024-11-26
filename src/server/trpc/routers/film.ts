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
import { createStudioAction } from "@/server/studio/actions/studio.action";

export const filmRouter = router({
  getFilms: publicProcedure
    .input(z.custom<TIndexFilmQueryParam>())
    .query(({ input }) => getFilmsAction(input)),

  getFilm: publicProcedure.input(z.string()).query(({ input }) => getFilmAction(input)),

  updateStudio: publicProcedure
    .input(
      z.object({
        data: createOrUpdateFilmSchema,
        id: z.string(),
      }),
    )
    .mutation(({ input }) => updateFilmAction(input)),

  delteStudio: publicProcedure.input(z.string()).mutation(({ input }) => deleteFilmAction(input)),

  createStudio: publicProcedure
    .input(createOrUpdateFilmSchema)
    .mutation(({ input }) => createFilmAction(input)),
});
