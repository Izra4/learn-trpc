import { TPaginationResponse } from "@/types/meta";
import { convertPaginationMeta } from "@/utils/datatable";
import { TIndexUserQueryParam } from "../validations/index-user.validation";
import prisma from "@/libs/prisma/prisma";
import { User } from "@prisma/client";
import { UserWithRole } from "@/libs/prisma/types/user-with-role";

export const userPagination = async (
  queryParam: TIndexUserQueryParam,
): Promise<TPaginationResponse<UserWithRole[]>> => {
  const [data, meta] = await prisma.user
    .paginate({
      include: {
        role: true,
      },
      where: {
        deletedAt: null,
        // Search filter
        ...(queryParam.search
          ? {
              fullname: {
                contains: queryParam.search,
              },
            }
          : {}),
        ...(queryParam.created_at
          ? {
              createdAt: {
                ...(queryParam.created_at[0] ? { gte: new Date(queryParam.created_at[0]) } : {}),
                ...(queryParam.created_at[1] ? { lte: new Date(queryParam.created_at[1]) } : {}),
              },
            }
          : {}),
      },
      orderBy: {
        ...(queryParam.sort && queryParam.order
          ? {
              [queryParam.sort]: queryParam.order,
            }
          : {
              createdAt: "asc",
            }),
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

export const findOneUserById = async (id: string): Promise<User | undefined> => {
  return (
    (await prisma.user.findUnique({
      where: {
        id,
      },
    })) ?? undefined
  );
};

export const findOneUserWithRoleById = async (id: string) => {
  return (
    (await prisma.user.findUnique({
      include: {
        role: true,
      },
      where: {
        id,
      },
    })) ?? undefined
  );
};

export const findOneUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

export const isEmailAlreadyUsed = async (email: string) => {
  const registeredEmail = await prisma.user.count({
    where: {
      email,
    },
  });

  return registeredEmail > 0;
};

export const createUser = async (data: User): Promise<void> => {
  await prisma.user.create({
    data,
  });
};

export const updateUserById = async (id: string, data: User): Promise<void> => {
  await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteUserById = async (id: string): Promise<void> => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};
