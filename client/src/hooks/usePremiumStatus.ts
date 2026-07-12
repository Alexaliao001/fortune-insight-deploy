import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export type FeatureType = "tarot" | "bazi" | "dream" | "horoscope";

interface PremiumStatus {
  /** User has active membership (monthly/yearly/lifetime) */
  isMember: boolean;
  /** User can use this specific feature (member OR has free/paid credits) */
  canUse: boolean;
  /** Remaining free uses (-1 = unlimited) */
  freeRemaining: number;
  /** Remaining paid credits */
  paidCredits: number;
  /** Whether the full report should be shown (member or has paid for this feature) */
  showFullReport: boolean;
  /** Loading state */
  isLoading: boolean;
}

/**
 * Hook to check if user has premium access to a specific feature.
 * Used to control the isPaid prop on report components.
 */
export function usePremiumStatus(featureType: FeatureType): PremiumStatus {
  const { isAuthenticated } = useAuth();

  const { data: usage, isLoading } = trpc.usage.getStatus.useQuery(
    { featureType },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return {
      isMember: false,
      canUse: true, // Allow guests to use all features for conversion
      freeRemaining: -1, // Don't show usage limits for guests
      paidCredits: 0,
      showFullReport: true, // Show full basic report to guests (drives engagement → registration)
      isLoading: false,
    };
  }

  if (isLoading || !usage) {
    return {
      isMember: false,
      canUse: true,
      freeRemaining: 0,
      paidCredits: 0,
      showFullReport: false,
      isLoading: true,
    };
  }

  return {
    isMember: usage.isMember,
    canUse: usage.canUse,
    freeRemaining: usage.freeRemaining,
    paidCredits: usage.paidCredits,
    // Show full report if user is a member OR has paid credits for this feature
    showFullReport: usage.isMember || usage.paidCredits > 0,
    isLoading: false,
  };
}
