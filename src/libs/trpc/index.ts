import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { type AppRouter } from "@/server/trpc/root";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
  transformer: superjson,
});
