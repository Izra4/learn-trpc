import { Prisma } from "@prisma/client";

export type FilmWithGenre = Prisma.FilmGetPayload<{
  include: {
    genres: {
      select: {
        genre: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;
