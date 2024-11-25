import { IndexQueryParamSchema } from "@/types/index-query-param";
import { z } from "zod";

export type TIndexGenreQueryParam = z.infer<typeof IndexQueryParamSchema>;
