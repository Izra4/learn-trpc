import { TIndexStudioQueryParam } from "@/server/studio/validations/index-studio.validation";
import { TCreateOrUpdateStudioValidation } from "@/server/studio/validations/studio.validation";

export const getStudiosAction = async (queryParam: TIndexStudioQueryParam) => {};

export const getStudioAction = async (id?: string) => {};

export const updateStudioAction = async (input: {
  value: TCreateOrUpdateStudioValidation;
  id: string;
}) => {};

export const deleteStudioAction = async (id?: string) => {};

export const createStudioAction = async (input: TCreateOrUpdateStudioValidation) => {};
