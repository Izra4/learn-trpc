import { Facility } from "@prisma/client";
import prisma from "@/libs/prisma/prisma";

export const createNewFacility = async (data: Facility): Promise<void> => {
  await prisma.facility.create({
    data,
  });
};

export const findAllFacility = async (): Promise<Facility[]> => {
  return await prisma.facility.findMany();
};

export const findFacilityById = async (id: string): Promise<Facility | null> => {
  return await prisma.facility.findUnique({
    where: {
      id,
    },
  });
};

export const updateFacilityById = async (id: string, data: Facility): Promise<void> => {
  await prisma.facility.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteFacilityById = async (id: string): Promise<void> => {
  await prisma.facility.delete({
    where: {
      id,
    },
  });
};
