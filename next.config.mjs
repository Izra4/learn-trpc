import { withSentryConfig } from "@sentry/nextjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: { "/": ["./node_modules/argon2/prebuilds/linux-x64/*.musl.*"] },
  },
  transpilePackages: ["admiral"],
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias["@/components"] = path.join(__dirname, "src/app/_components");
    config.resolve.alias["@/hooks"] = path.join(__dirname, "src/app/_hooks");
    config.resolve.alias["@/app"] = path.join(__dirname, "src/app");
    config.resolve.alias["@/common"] = path.join(__dirname, "src/common");
    config.resolve.alias["@/libs"] = path.join(__dirname, "src/libs");
    config.resolve.alias["@/server"] = path.join(__dirname, "src/server");
    config.resolve.alias["@/utils"] = path.join(__dirname, "src/utils");
    config.resolve.alias["@/types"] = path.join(__dirname, "src/types");
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default withSentryConfig(
  withSentryConfig(nextConfig, {
    org: "sentry",
    authToken: process.env.SENTRY_TOKEN,
    project: process.env.SENTRY_PROJECT,
    sentryUrl: process.env.SENTRY_URL,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
    productionBrowserSourceMaps: true,
  }),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "a-va",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);
