"use server";
import "server-only";
import { eq } from "drizzle-orm";
import { db } from "../drizzle/connection";
import { roles, users } from "../drizzle/schema";
import { verifyPassword } from "./password";
import { signOut } from "./auth";

export const checkEmail = async (email?: string | null) => {
  if (!email) return "Email wajib diisi";
  try {
    const res = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .then((res) => res.length > 0);
    return res;
  } catch (err) {
    throw err;
  }
};

export const checkPassword = async (password?: string, email?: string) => {
  if (!password) return;
  if (!email) return;
  try {
    const hashedPassword = await db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.email, email))
      .then((res) => res.at(0)?.password);

    if (hashedPassword) {
      const comparePassword = await verifyPassword(password, String(hashedPassword));
      return comparePassword;
    }
  } catch (err) {
    throw err;
  }
};

export const getUserData = async (email?: string | null) => {
  if (!email) return;
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        roles: {
          with: {
            rolePermissions: {
              with: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export const getRoleData = async (roleId?: string | null) => {
  if (!roleId) return;
  try {
    const res = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .then((res) => res.at(0));
    return res;
  } catch (err) {
    throw err;
  }
};

export const logOut = async () => {
  try {
    return await signOut({
      redirect: true,
      redirectTo: "/auth/login",
    });
  } catch (err) {
    throw err;
  }
};
