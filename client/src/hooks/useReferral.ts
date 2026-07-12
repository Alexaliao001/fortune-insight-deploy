import { useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const REFERRAL_STORAGE_KEY = "fortune_referral_code";

/**
 * Captures referral code from URL (?ref=CODE) and processes it after login.
 * - On page load: checks URL for ?ref= param, stores in localStorage
 * - After login: submits the stored referral code to the server
 * - Cleans up after successful processing
 */
export function useReferral() {
  const { user } = useAuth();
  const processedRef = useRef(false);
  const processReferral = trpc.referral.processReferral.useMutation();

  // Step 1: Capture referral code from URL on any page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    if (refCode) {
      localStorage.setItem(REFERRAL_STORAGE_KEY, refCode.toUpperCase());
      // Clean URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // Step 2: Process referral after user logs in
  useEffect(() => {
    if (!user || processedRef.current) return;

    const storedCode = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!storedCode) return;

    processedRef.current = true;

    processReferral.mutate(
      { referralCode: storedCode },
      {
        onSuccess: (result) => {
          if (result.success) {
            localStorage.removeItem(REFERRAL_STORAGE_KEY);
            console.log("[Referral] Successfully processed:", storedCode);
          } else {
            // Already referred or invalid code - clean up
            localStorage.removeItem(REFERRAL_STORAGE_KEY);
            console.log("[Referral] Not processed:", result.message);
          }
        },
        onError: () => {
          // Don't remove on error - retry next time
          processedRef.current = false;
          console.error("[Referral] Failed to process, will retry");
        },
      }
    );
  }, [user]);
}
