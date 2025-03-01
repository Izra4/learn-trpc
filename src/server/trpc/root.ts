import { router } from "./router";
import { helloRouter } from "./routers/hello";
import { userRouter } from "./routers/user";
import { genreRouter } from "@/server/trpc/routers/genre";
import { facilityRouter } from "@/server/trpc/routers/facility";
import { studioRouter } from "@/server/trpc/routers/studio";
import { filmRouter } from "@/server/trpc/routers/film";
import { scheduleRouter } from "@/server/trpc/routers/schedule";

export const appRouter = router({
  hello: helloRouter,
  user: userRouter,
  genre: genreRouter,
  facility: facilityRouter,
  studio: studioRouter,
  film: filmRouter,
  schedule: scheduleRouter,
});

export type AppRouter = typeof appRouter;
