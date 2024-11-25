import { Prisma } from "@prisma/client";

export type StudioWithFacility = Prisma.StudioGetPayload<{
  include: {
    facilities: {
      include: {
        facility: true;
      };
    };
  };
}>;
