import { Facility } from "@prisma/client";
import prisma from "@/libs/prisma/prisma";
import { TIndexFacilityQueryParam } from "@/server/facility/validations/index-facility.validation";
import { TPaginationResponse } from "@/types/meta";
import { convertPaginationMeta } from "@/utils/datatable";

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

export const facilityPagination = async (
  param: TIndexFacilityQueryParam,
): Promise<TPaginationResponse<Facility[]>> => {
  const [data, meta] = await prisma.facility
    .paginate({
      where: {
        deletedAt: null,
        ...(param.search
          ? {
              name: {
                contains: param.search,
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
