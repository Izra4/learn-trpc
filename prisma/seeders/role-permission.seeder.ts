import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { ROLE_DUMMY } from "@/common/enums/role-dummy.enum";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function rolePermissionSeeder() {
  console.log("Seeding role permissions...");
  const dummyRolePermissions = [
    {
      role: ROLE_DUMMY.ADMIN,
      permissions: [
        PERMISSIONS.DASHBOARD,
        PERMISSIONS.STUDIO_CREATE,
        PERMISSIONS.STUDIO_READ,
        PERMISSIONS.STUDIO_UPDATE,
        PERMISSIONS.STUDIO_DELETE,
        PERMISSIONS.STUDIO_DETAIL,
        PERMISSIONS.USER_CREATE,
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_UPDATE,
        PERMISSIONS.USER_DELETE,
        PERMISSIONS.USER_DETAIL,
        PERMISSIONS.ROLE_CREATE,
        PERMISSIONS.ROLE_UPDATE,
        PERMISSIONS.ROLE_DELETE,
        PERMISSIONS.ROLE_DETAIL,
        PERMISSIONS.ROLE_READ,
        PERMISSIONS.FILM_CREATE,
        PERMISSIONS.FILM_UPDATE,
        PERMISSIONS.FILM_DELETE,
        PERMISSIONS.FILM_DETAIL,
        PERMISSIONS.FILM_READ,
        PERMISSIONS.GENRE_CREATE,
        PERMISSIONS.GENRE_UPDATE,
        PERMISSIONS.GENRE_DELETE,
        PERMISSIONS.GENRE_DETAIL,
        PERMISSIONS.GENRE_READ,
        PERMISSIONS.FACILITY_CREATE,
        PERMISSIONS.FACILITY_UPDATE,
        PERMISSIONS.FACILITY_DELETE,
        PERMISSIONS.FACILITY_DETAIL,
        PERMISSIONS.FACILITY_READ,
      ],
    },
    {
      role: ROLE_DUMMY.USER,
      permissions: [
        PERMISSIONS.DASHBOARD,
        PERMISSIONS.STUDIO_READ,
        PERMISSIONS.STUDIO_DETAIL,
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_DETAIL,
        PERMISSIONS.ROLE_READ,
        PERMISSIONS.ROLE_DETAIL,
        PERMISSIONS.FILM_READ,
        PERMISSIONS.FILM_DETAIL,
        PERMISSIONS.GENRE_READ,
        PERMISSIONS.GENRE_DETAIL,
        PERMISSIONS.FACILITY_READ,
        PERMISSIONS.FACILITY_DETAIL,
      ],
    },
  ];

  const newRolePermissions = [];

  for (const roleRolePermission of dummyRolePermissions) {
    const role = await prisma.role.findFirstOrThrow({
      where: {
        name: roleRolePermission.role,
      },
    });

    for (const permission of roleRolePermission.permissions) {
      const permissionData = await prisma.permission.findFirstOrThrow({
        where: {
          name: permission,
        },
      });

      newRolePermissions.push({
        roleId: role.id,
        permissionId: permissionData.id,
      });
    }
  }

  await prisma.rolePermission.createMany({
    data: newRolePermissions,
  });

  console.log("Role permissions seeded");
}
