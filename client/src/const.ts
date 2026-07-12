export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/** Site-native login page (email/password). */
export const getLoginUrl = (returnTo?: string) => {
  const params = new URLSearchParams();
  if (returnTo) {
    params.set("returnTo", returnTo);
  } else if (typeof window !== "undefined") {
    const current = window.location.pathname + window.location.search;
    if (current && current !== "/login" && !current.startsWith("/login?")) {
      params.set("returnTo", current);
    }
  }
  const q = params.toString();
  return q ? `/login?${q}` : "/login";
};
