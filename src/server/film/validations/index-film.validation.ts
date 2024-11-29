import { z } from "zod";
import { IndexQueryParamSchema } from "@/types/index-query-param";

export const IndexFIlmQueryParamSchema = IndexQueryParamSchema.extend({
  duration: z.string().optional(),
});

export type TIndexFilmQueryParam = z.infer<typeof IndexFIlmQueryParamSchema>;
