// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

import { pagination } from "prisma-extension-pagination";
import { QueryEvent } from "./query-event";
import { PrismaClient } from "@prisma/client";
import { createSoftDeleteExtension } from "prisma-extension-soft-delete";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
    ],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

/**
 * Prisma With Trashed (tanpa soft-delete)
 *
 * IMPORTANT: Saat ini belum ada fitur `withTrashed` di prisma-extension-soft-delete
 * Jadi, gunakan `prismaWithTrashed` untuk INCLUDE data yang sudah dihapus
 *
 * Example:
 * const { withTrashed } = queryParam;
 * const [data, meta] = await (withTrashed ? prismaWithTrashed : prisma).user.paginate({...});
 *
 */
export const prismaWithTrashed = prisma.$extends(
  pagination({
    pages: {
      includePageCount: true,
    },
  }),
);

/**
 * Prisma client with Pagination and Soft Delete extension.
 *
 * IMPORTANT: Untuk include soft-deleted data, gunakan `prismaWithTrashed`
 */
export default prismaWithTrashed.$extends(
  createSoftDeleteExtension({
    models: {
      User: true,
    },
    defaultConfig: {
      field: "deletedAt",
      createValue: (deleted: any) => {
        if (deleted) return new Date();
        return null;
      },
    },
  }),
);

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
