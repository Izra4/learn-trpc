// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

import { pagination } from "prisma-extension-pagination";
import { QueryEvent } from "./query-event";
import { PrismaClient } from "@prisma/client";

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

// Soft delete middleware
prisma.$use(async (params, next) => {
  // Check incoming query type
  if (params.model === "User")
    if (params.action === "delete") {
      // Delete queries
      // Change action to an update
      params.action = "update";
      params.args.data = { deletedAt: new Date() };
    }

  if (params.action === "deleteMany") {
    // Delete many queries
    // Change action to an update
    params.action = "updateMany";
    params.args.data = { deletedAt: new Date() };
  }

  return next(params);
});

prisma.$on("query", (e: QueryEvent) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

export default prisma.$extends(
  pagination({
    pages: {
      includePageCount: true,
    },
  }),
);

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
