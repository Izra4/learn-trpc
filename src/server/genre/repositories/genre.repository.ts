import prisma from "@/libs/prisma/prisma";
import { Genre, User } from "@prisma/client";
import { promise } from "zod";

export const createNewGenre = async (data: Genre): Promise<void> => {
  await prisma.genre.create({
    data,
  });
};

export const findAllGenre = async (): Promise<Genre[]> => {
  return await prisma.genre.findMany();
};

export const findGenreById = async (id: string): Promise<Genre | null> => {
  return await prisma.genre.findUnique({
    where: {
      id,
    },
  });
};

export const updateGenreById = async (id: string, data: Genre): Promise<void> => {
  await prisma.genre.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteGenreById = async (id: string): Promise<void> => {
  await prisma.genre.delete({
    where: {
      id,
    },
  });
};
