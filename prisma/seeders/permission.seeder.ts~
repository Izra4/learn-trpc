import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function permissionSeeder() {
  const dummyPermissions = [
    {
      name: PERMISSIONS.DASHBOARD,
    },
    {
      name: PERMISSIONS.USER_CREATE,
    },
    {
      name: PERMISSIONS.USER_READ,
    },
    {
      name: PERMISSIONS.USER_UPDATE,
    },
    {
      name: PERMISSIONS.USER_DELETE,
    },
    {
      name: PERMISSIONS.USER_DETAIL,
    },
    {
      name: PERMISSIONS.ROLE_CREATE,
    },
    {
      name: PERMISSIONS.ROLE_UPDATE,
    },
    {
      name: PERMISSIONS.ROLE_DELETE,
    },
    {
      name: PERMISSIONS.ROLE_DETAIL,
    },
    {
      name: PERMISSIONS.ROLE_READ,
    },
    {
      name: PERMISSIONS.FILM_CREATE,
    },
    {
      name: PERMISSIONS.FILM_UPDATE,
    },
    {
      name: PERMISSIONS.FILM_DELETE,
    },
    {
      name: PERMISSIONS.FILM_DETAIL,
    },
    {
      name: PERMISSIONS.FILM_READ,
    },
    {
      name: PERMISSIONS.GENRE_CREATE,
    },
    {
      name: PERMISSIONS.GENRE_UPDATE,
    },
    {
      name: PERMISSIONS.GENRE_DELETE,
    },
    {
      name: PERMISSIONS.GENRE_DETAIL,
    },
    {
      name: PERMISSIONS.GENRE_READ,
    },
    {
      name: PERMISSIONS.FACILITY_CREATE,
    },
    {
      name: PERMISSIONS.FACILITY_UPDATE,
    },
    {
      name: PERMISSIONS.FACILITY_DELETE,
    },
    {
      name: PERMISSIONS.FACILITY_DETAIL,
    },
    {
      name: PERMISSIONS.FACILITY_READ,
    },
    {
      name: PERMISSIONS.STUDIO_CREATE,
    },
    {
      name: PERMISSIONS.STUDIO_UPDATE,
    },
    {
      name: PERMISSIONS.STUDIO_DELETE,
    },
    {
      name: PERMISSIONS.STUDIO_DETAIL,
    },
    {
      name: PERMISSIONS.STUDIO_READ,
    },
  ];

  await prisma.permission.createMany({
    data: dummyPermissions,
  });
}
