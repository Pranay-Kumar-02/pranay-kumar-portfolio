export const UMAMI_SRC = process.env.UMAMI_DOMAIN || "";

// script url and collect api share an origin. never throw on a malformed
// UMAMI_DOMAIN — this module is imported by the root layout
export const UMAMI_ORIGIN = URL.canParse(UMAMI_SRC)
  ? new URL(UMAMI_SRC).origin
  : "";
