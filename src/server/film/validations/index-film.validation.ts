import { z } from "zod";
import { IndexQueryParamSchema } from "@/types/index-query-param";

export type TIndexFilmQueryParam = z.infer<typeof IndexQueryParamSchema>;
