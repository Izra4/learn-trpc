import { z } from "zod";
import { IndexQueryParamSchema } from "@/types/index-query-param";

export type TIndexScheduleQueryParam = z.infer<typeof IndexQueryParamSchema>;
