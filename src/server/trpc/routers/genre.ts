import { publicProcedure, router } from "@/server/trpc/router";
import {
  createGenreAction,
  deleteGenreAction,
  getGenreAction,
  getGenresAction,
  updateGenreAction,
} from "@/server/genre/actions/genre.action";
import { z } from "zod";
import { createGenreSchema } from "@/server/genre/validation/genre.validation";
import { TIndexGenreQueryParam } from "@/server/genre/validation/index-genre.validation";
export const genreRouter = router({
  getGenres: publicProcedure
    .input(z.custom<TIndexGenreQueryParam>())
    .query(({ input }) => getGenresAction(input)),

  getGenre: publicProcedure
    .input(z.string().optional())
    .query(({ input }) => getGenreAction(input)),

  createGenre: publicProcedure
    .input(createGenreSchema)
    .mutation(({ input }) => createGenreAction(input)),

  updateGenre: publicProcedure
    .input(
      z.object({
        value: createGenreSchema,
        id: z.string(),
      }),
    )
    .mutation(({ input }) => updateGenreAction(input)),

  deleteUser: publicProcedure.input(z.string()).mutation(({ input }) => deleteGenreAction(input)),
});
