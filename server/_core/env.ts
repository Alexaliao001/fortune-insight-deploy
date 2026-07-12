export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",
  /** Public site URL used in emails/share links. Override via APP_BASE_URL. */
  appBaseUrl: (process.env.APP_BASE_URL ?? "https://fortunesite.one").replace(
    /\/$/,
    ""
  ),
};

/** Soft warnings only — never crash boot (Manus injects secrets at runtime). */
export function warnMissingEnv(): void {
  const missing: string[] = [];
  if (!ENV.cookieSecret) missing.push("JWT_SECRET");
  if (!ENV.databaseUrl) missing.push("DATABASE_URL");
  if (ENV.isProduction) {
    if (!ENV.forgeApiKey) missing.push("BUILT_IN_FORGE_API_KEY");
    if (!ENV.stripeSecretKey) missing.push("STRIPE_SECRET_KEY");
  }
  if (missing.length > 0) {
    console.warn(
      `[ENV] Missing recommended variables: ${missing.join(", ")}. Some features may not work.`
    );
  }
}
