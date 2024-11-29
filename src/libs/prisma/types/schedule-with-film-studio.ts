import { Prisma } from "@prisma/client";

export type ScheduleWithStudioFilm = Prisma.FilmScheduleGetPayload<{
  include: {
    studio: true;
    film: true;
  };
}>;
