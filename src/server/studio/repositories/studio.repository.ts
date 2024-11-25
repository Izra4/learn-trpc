import prisma from "@/libs/prisma/prisma";
import { Studio } from "@prisma/client";

export const createNewStudio = async (name: string, capacity: number, facilitiesId: string[]) => {
  return await prisma.$transaction(async (tx) => {
    const Studio = await tx.studio.create({
      data: {
        name,
        capacity,
      },
    });
    await Promise.all(
      facilitiesId.map((facilityId) =>
        tx.facilityStudio.create({
          data: {
            studioId: Studio.id,
            facilityId,
          },
        }),
      ),
    );
  });
};

export const findStudiosWithFacilities = async (): Promise<Studio[]> => {
  return await prisma.studio.findMany();
};

export const findStudioById = async (id: string): Promise<Studio | null> => {
  return await prisma.studio.findUnique({ where: { id } });
};

export const deleteStudioById = async (id: string): Promise<void> => {
  await prisma.studio.delete({ where: { id } });
};
