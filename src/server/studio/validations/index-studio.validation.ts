import { IndexQueryParamSchema } from "@/types/index-query-param";
import { z } from "zod";

export type TIndexStudioQueryParam = z.infer<typeof IndexQueryParamSchema>;
