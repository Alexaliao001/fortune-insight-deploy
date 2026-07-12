/**
 * T10: abstract geometric card back / face shell (no commercial deck art).
 */
import { Moon, Sparkles } from "lucide-react";

type Props = {
  variant: "back" | "face";
  className?: string;
  children?: React.ReactNode;
  reversed?: boolean;
};

export function TarotCardFace({ variant, className = "", children, reversed }: Props) {
  if (variant === "back") {
    return (
      <div
        className={`absolute inset-0 rounded-lg overflow-hidden border border-[#d4a843]/35 bg-gradient-to-br from-[#24183f] via-[#1a1030] to-[#0c0818] TarotCardFace ${className}`}
        data-tarot-card-face="back"
      >
        <div className="absolute inset-[3px] rounded-md border border-[#d4a843]/20" />
        {/* geometric lattice */}
        <div
          className="absolute inset-2 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(212,168,67,0.35) 1px, transparent 1px), linear-gradient(45deg, rgba(212,168,67,0.2) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full border border-[#d4a843]/40 flex items-center justify-center bg-[#d4a843]/10">
            <Moon className="w-3.5 h-3.5 text-[#d4a843]/85" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-3 bg-gradient-to-b from-[#1e1635] to-[#120c22] TarotCardFace ${className}`}
      data-tarot-card-face="face"
      data-tarot-orientation={reversed ? "reversed" : "upright"}
      style={{
        transform: reversed ? "rotate(180deg)" : undefined,
      }}
    >
      <div className="absolute inset-[4px] rounded-lg border border-[#d4a843]/15 pointer-events-none" />
      {reversed && (
        <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[8px] px-1.5 py-0.5 rounded bg-[#d4a843]/20 text-[#d4a843] border border-[#d4a843]/40 z-10 rotate-180">
          {/* label stays readable: counter-rotate text */}
          <span className="inline-block rotate-180">REV</span>
        </span>
      )}
      {children ?? (
        <div className="w-8 h-8 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/30 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#d4a843]" />
        </div>
      )}
    </div>
  );
}
