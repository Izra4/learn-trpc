"use server";

import { TIndexStudioQueryParam } from "@/server/studio/validations/index-studio.validation";
import {
  createOrUpdateStudioSchema,
  TCreateOrUpdateStudioValidation,
} from "@/server/studio/validations/studio.validation";
import { serverCheckPermission } from "@/utils/permission";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { validate } from "@/utils/zod-validate";
import {
  createNewStudio,
  deleteStudioById,
  studioPagination,
  updateStudioById,
} from "@/server/studio/repositories/studio.repository";
import { Studio } from "@prisma/client";
import { throws } from "node:assert";
import NotFoundException from "../../../errors/NotFoundException";

export const getStudiosAction = async (queryParam: TIndexStudioQueryParam) => {
  await serverCheckPermission([PERMISSIONS.STUDIO_READ]);

  return await studioPagination(queryParam);
};

export const getStudioAction = async (id?: string): Promise<Studio | undefined> => {
  await serverCheckPermission([PERMISSIONS.STUDIO_DETAIL]);

  if (!id) return undefined;

  const studio = await getStudioAction(id);
  if (!studio) throw new NotFoundException("Studio tidak ditemukan");

  return studio;
};

export const updateStudioAction = async (input: {
  value: TCreateOrUpdateStudioValidation;
  id: string;
}) => {
  await serverCheckPermission([PERMISSIONS.STUDIO_UPDATE]);

  await validate(createOrUpdateStudioSchema, input.value);

  await updateStudioById(
    input.id,
    input.value.name,
    input.value.capacity,
    input.value.facilityAdded,
    input.value.facilityRemoved,
  );
};

export const deleteStudioAction = async (id?: string) => {
  await serverCheckPermission([PERMISSIONS.STUDIO_DELETE]);

  await deleteStudioById(id);
};

export const createStudioAction = async (input: TCreateOrUpdateStudioValidation) => {
  await serverCheckPermission([PERMISSIONS.STUDIO_CREATE]);

  await validate(createOrUpdateStudioSchema, input);

  await createNewStudio(input.name, input.capacity, input.facilityAdded);
};
