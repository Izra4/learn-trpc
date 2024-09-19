import { TPaginationResponse } from "@/types/meta";
import { convertPaginationMeta } from "@/utils/paginate-util";
import { TIndexRoleQueryParam } from "../validations/index-role.validation";
import prisma from "@/libs/prisma/prisma";
import { Role } from "@prisma/client";
import { RoleDto } from "../dtos/role.dto";

export const rolePagination = async (
  queryParam: TIndexRoleQueryParam,
): Promise<TPaginationResponse<Role[]>> => {
  const [data, meta] = await prisma.role
    .paginate({
      where: {
        OR: [
          {
            name: {
              contains: queryParam.search,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    })
    .withPages({
      limit: queryParam.perPage,
      page: queryParam.page,
    });

  return {
    data,
    meta: convertPaginationMeta(meta, queryParam),
  };
};

export const findRolesBySearch = async (search: string): Promise<Role[]> => {
  return await prisma.role.findMany({
    where: {
      name: {
        contains: search,
      },
    },
  });
};

export const findOneRoleById = async (id: string): Promise<Role | null> => {
  return await prisma.role.findUnique({
    where: {
      id,
    },
  });
};

export const findOneRoleWithPermissionsById = async (id: string) => {
  return (
    (await prisma.role.findUnique({
      where: {
        id,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    })) ?? undefined
  );
};

export const createRoleAndPermissions = async (role: RoleDto): Promise<void> => {
  await prisma.role.create({
    data: {
      name: role.name,
      rolePermissions: {
        createMany: {
          data: role.permissionIds.map((permissionId) => ({
            permissionId,
          })),
        },
      },
    },
  });
};

export const updateRoleAndPermissionsById = async (id: string, role: RoleDto): Promise<void> => {
  await prisma.role.update({
    where: {
      id,
    },
    data: {
      name: role.name,
      rolePermissions: {
        deleteMany: {
          roleId: id,
        },
        createMany: {
          data: role.permissionIds.map((permissionId) => ({
            permissionId,
          })),
        },
      },
    },
  });
};

export const deleteRoleById = async (id: string): Promise<void> => {
  prisma.role.delete({
    where: {
      id,
    },
  });
};
