"use server";
import { hashPassword } from "@/libs/auth/password";
import { TPaginationResponse } from "@/types/meta";
import { User } from "@/libs/drizzle/schemas/user.schema";
import {
  createUser,
  deleteUserById,
  findOneUserByEmail,
  findOneUserById,
  updateUserById,
  userPagination,
} from "../repositories/user.repository";
import {
  createOrUpdateUserSchema,
  TCreateOrUpdateUserValidation,
} from "../validations/create-or-update.validation";
import { findOneRoleById } from "@/server/role/repositories/role.repository";
import { TIndexUserQueryParam } from "../validations/index-user.validation";
import { validate } from "@/utils/zod-validate";
import { serverCheckPermission } from "@/utils/permission";
import { PERMISSIONS } from "@/common/enums/permissions.enum";

export const getUsersAction = async (
  queryParam: TIndexUserQueryParam,
): Promise<TPaginationResponse<User[]>> => {
  // Permission authorization
  await serverCheckPermission([PERMISSIONS.USER_READ]);

  return userPagination(queryParam);
};

export const getUser = async (from?: string) => {
  // Permission authorization
  await serverCheckPermission([PERMISSIONS.USER_DETAIL]);

  if (!from) return undefined;
  const user = await findOneUserById(from);
  return user;
};

export const createUserAction = async (value: TCreateOrUpdateUserValidation) => {
  // Permission authorization
  await serverCheckPermission([PERMISSIONS.USER_CREATE]);

  // Validation
  validate(createOrUpdateUserSchema, value);

  // Simulate error
  if (value.fullname === "error") throw new Error("fullname can not be error");

  const role = await findOneRoleById(value.roleId);
  if (!role) {
    throw new Error("Role tidak ditemukan");
  }
  const email = await findOneUserByEmail(value.email);
  if (email) {
    throw new Error("Email sudah digunakan");
  }
  const password = await hashPassword(value.password);
  await createUser({
    ...value,
    password,
  } as User);
};

export const updateUserAction = async ({
  value,
  id,
}: {
  value: TCreateOrUpdateUserValidation;
  id: string;
}) => {
  // Permission authorization
  await serverCheckPermission([PERMISSIONS.USER_UPDATE]);

  // Validation
  validate(createOrUpdateUserSchema, value);

  const user = await findOneUserById(id);
  if (!user) {
    throw "User tidak ditemukan";
  }

  // Check if role exists
  const role = await findOneRoleById(value.roleId);
  if (!role) {
    throw new Error("Role tidak ditemukan");
  }

  // Check if email exists and is not the same as the current user
  const email = await findOneUserByEmail(value.email);
  if (email && email.id !== id) {
    throw new Error("Email sudah digunakan");
  }

  user.fullname = value.fullname;
  user.address = value.address;
  user.password = await hashPassword(value.password);
  user.email = value.email;
  user.roleId = value.roleId;

  await updateUserById(id, user);
};

export const deleteUserAction = async (from: string) => {
  // Permission authorization
  await serverCheckPermission([PERMISSIONS.USER_DELETE]);

  await deleteUserById(from);
};
