import { Prisma } from "@prisma/client";

export type StudioWithFacility = Prisma.StudioGetPayload<{
  include: {
    facilities: true;
  };
}>;
