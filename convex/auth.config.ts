import { AuthConfig } from "convex/server";

const issuerDomain =
  process.env.CLERK_JWT_ISSUER_DOMAIN ??
  "https://mutual-lacewing-78.clerk.accounts.dev";

export default {
  providers: [
    {
      domain: issuerDomain.endsWith("/") ? issuerDomain.slice(0, -1) : issuerDomain,
      applicationID: "convex",
    },
    {
      domain: issuerDomain.endsWith("/") ? issuerDomain : `${issuerDomain}/`,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
