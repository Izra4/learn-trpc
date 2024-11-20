import { ROLE_DUMMY } from "@/common/enums/role-dummy.enum";
import { hashPassword } from "@/libs/auth/password";
import { PrismaClient, Role, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function userSeeder() {
  console.log("Seeding users...");

  const users: Pick<User, "email" | "fullname" | "password" | "emailVerifiedAt" | "roleId">[] = [];
  const roles = await prisma.role.findMany();

  // Manual indexing roles result
  const rolesByName = roles.reduce(
    (acc, role) => {
      acc[role.name] = role;
      return acc;
    },
    {} as Record<string, Role>,
  );

  for (let i = 0; i < 100; i++) {
    // Push user data to users array
    users.push({
      email: `johndoe${i + 1}@email.com`,
      fullname: `John Doe ${i + 1}`,
      password: await hashPassword(`password${i + 1}`),
      emailVerifiedAt: new Date(),
      roleId: null,
    });

    if (i <= 50) {
      users[i].roleId = rolesByName[ROLE_DUMMY.ADMIN]?.id ?? null;
    } else {
      users[i].roleId = rolesByName[ROLE_DUMMY.USER]?.id ?? null;
    }
  }

  await prisma.user.createMany({
    data: users,
  });

  console.log("Users seeded!");
}
