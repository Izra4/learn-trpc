import { z } from "zod";

export const IndexQueryParamSchema = z.object({
  page: z.number().default(1),
  perPage: z.number().default(10),
  search: z.string().optional(),
  order: z.string().optional(),
  sort: z.string().optional(),
  created_at: z.string().optional(),
});

export type TIndexQueryParam = z.infer<typeof IndexQueryParamSchema>;
