import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * ShareRedirect page — handles /share URLs from social media.
 * 
 * Social crawlers get intercepted by the server-side ogMetaMiddleware
 * and receive dynamic OG meta tags. Regular users land here and get
 * redirected to the homepage.
 */
export default function ShareRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to homepage, preserving UTM params for analytics
    const params = new URLSearchParams(window.location.search);
    const utm = new URLSearchParams();
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
      const val = params.get(key);
      if (val) utm.set(key, val);
    }
    const query = utm.toString();
    setLocation(query ? `/?${query}` : "/", { replace: true });
  }, [setLocation]);

  return null;
}
