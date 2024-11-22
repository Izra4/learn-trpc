import {
  createOrUpdateFacilitySchema,
  TCreateOrUpdateFacilityValidation,
} from "@/server/facility/validations/facility.validation";
import { serverCheckPermission } from "@/utils/permission";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { validate } from "@/utils/zod-validate";
import {
  createNewFacility,
  findAllFacility,
  findFacilityById,
  updateFacilityById,
} from "@/server/facility/repositories/facility.repository";
import { Facility } from "@prisma/client";
import NotFoundException from "../../../errors/NotFoundException";
import BadRequestException from "../../../errors/BadRequestException";

export const createFacilityAction = async (data: TCreateOrUpdateFacilityValidation) => {
  await serverCheckPermission([PERMISSIONS.FACILITY_CREATE]);

  await validate(createOrUpdateFacilitySchema, data);

  await createNewFacility({
    name: data.name,
  } as Facility);
};

export const getFacilitiesAction = async () => {
  return await findAllFacility();
};

export const getFacilityAction = async (id?: string) => {
  await serverCheckPermission([PERMISSIONS.FACILITY_READ]);

  if (!id) return undefined;

  const facility = await findFacilityById(id);

  if (!facility) throw new NotFoundException("Fasilitas tidak ditemukan");

  return facility;
};

export const updateFacilityAction = async ({
  value,
  id,
}: {
  value: TCreateOrUpdateFacilityValidation;
  id: string;
}) => {
  await serverCheckPermission([PERMISSIONS.FACILITY_UPDATE]);

  await validate(createOrUpdateFacilitySchema, value);

  await updateFacilityById(id, {
    name: value.name,
  } as Facility);
};

export const deleteFacilityAction = async (id: string) => {
  await serverCheckPermission([PERMISSIONS.FACILITY_DELETE]);

  if (id === "") throw new BadRequestException("id is undefined");

  await findFacilityById(id);
};
