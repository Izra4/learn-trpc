import { router } from "./router";
import { helloRouter } from "./routers/hello";
import { userRouter } from "./routers/user";
import { genreRouter } from "@/server/trpc/routers/genre";

export const appRouter = router({
  hello: helloRouter,
  user: userRouter,
  genre: genreRouter,
});

export type AppRouter = typeof appRouter;
