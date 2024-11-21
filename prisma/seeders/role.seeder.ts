import { ROLE_DUMMY } from "@/common/enums/role-dummy.enum";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function roleSeeder() {
  console.log("Seeding roles...");
  const dummyRoles = [
    {
      name: ROLE_DUMMY.ADMIN,
    },
    {
      name: ROLE_DUMMY.USER,
    },
  ];

  await prisma.role.createMany({
    data: dummyRoles,
  });

  console.log("Roles seeded!");
}
