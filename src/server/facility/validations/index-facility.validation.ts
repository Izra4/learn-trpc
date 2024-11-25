import { z } from "zod";
import { IndexQueryParamSchema } from "@/types/index-query-param";

export type TIndexFacilityQueryParam = z.infer<typeof IndexQueryParamSchema>;
