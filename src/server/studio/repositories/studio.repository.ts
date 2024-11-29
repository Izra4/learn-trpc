import prisma from "@/libs/prisma/prisma";
import { Studio } from "@prisma/client";
import { TIndexStudioQueryParam } from "@/server/studio/validations/index-studio.validation";
import { TPaginationResponse } from "@/types/meta";
import { StudioWithFacility } from "@/libs/prisma/types/studio-with-facility";
import { convertPaginationMeta } from "@/utils/datatable";
import { PrismaClient } from "@prisma/client/extension";

export const createNewStudio = async (name: string, capacity: number, facilitiesId?: string[]) => {
  return await prisma.$transaction(async (tx) => {
    const studio = await tx.studio.create({
      data: {
        name,
        capacity,
      },
    });

    if (facilitiesId && facilitiesId.length > 0) {
      const data = facilitiesId.map((facilityId) => ({
        studioId: studio.id,
        facilityId: facilityId,
      }));

      await tx.facilityStudio.createMany({
        data,
      });
    }
  });
};

export const studioPagination = async (
  param: TIndexStudioQueryParam,
): Promise<TPaginationResponse<StudioWithFacility[]>> => {
  const [data, meta] = await prisma.studio
    .paginate({
      include: {
        facilities: true,
      },
      where: {
        deletedAt: null,
        ...(param.search
          ? {
              name: {
                contains: param.search,
              },
            }
          : {}),
        ...(param.created_at
          ? {
              createdAt: {
                ...(param.created_at[0] ? { gte: new Date(param.created_at[0]) } : {}),
                ...(param.created_at[1] ? { lte: new Date(param.created_at[1]) } : {}),
              },
            }
          : {}),
      },
      orderBy: {
        ...(param.sort && param.order
          ? {
              [param.sort]: param.order,
            }
          : {
              createdAt: "asc",
            }),
      },
    })
    .withPages({
      limit: param.perPage,
      page: param.page,
    });

  return {
    data,
    meta: convertPaginationMeta(meta, param),
  };
};

export const findStudioByIdWithFacilities = async (id: string) => {
  return (
    (await prisma.studio.findUnique({
      where: {
        id,
      },
      include: {
        facilities: {
          include: {
            facility: true,
          },
        },
      },
    })) ?? undefined
  );
};

export const updateStudioById = async (
  id: string,
  name?: string,
  capacity?: number,
  addedFacilityIds?: string[],
  removedFacilityIds?: string[],
) => {
  return await prisma.$transaction(async (tx) => {
    const rawPrisma = new PrismaClient();

    const updatedStudio = await tx.studio.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(capacity && { capacity }),
      },
    });

    if (addedFacilityIds && addedFacilityIds.length > 0) {
      await tx.facilityStudio.createMany({
        data: addedFacilityIds.map((facilityId) => ({
          studioId: id,
          facilityId: facilityId,
        })),
      });
    }

    if (removedFacilityIds && removedFacilityIds.length > 0) {
      await rawPrisma.facilityStudio.deleteMany({
        where: {
          studioId: id,
          facilityId: { in: removedFacilityIds },
        },
      });
    }
    return updatedStudio;
  });
};

export const deleteStudioById = async (id?: string): Promise<void> => {
  await prisma.film.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
