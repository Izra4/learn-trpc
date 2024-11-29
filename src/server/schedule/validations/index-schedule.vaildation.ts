import { z } from "zod";
import { IndexQueryParamSchema } from "@/types/index-query-param";

export const IndexScheduleQueryParamSchema = IndexQueryParamSchema.extend({
  price: z.string().optional(),
});

export type TIndexScheduleQueryParam = z.infer<typeof IndexScheduleQueryParamSchema>;
