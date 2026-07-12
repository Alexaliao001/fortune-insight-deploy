import React from "react";

interface IconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

/*
 * Animated Feature Icons for Fortune Insight
 * Each icon has:
 *   - Multi-stop gradient fills with glow filters
 *   - Unique idle CSS animation (float, pulse, rotate, twinkle)
 *   - prefers-reduced-motion support via CSS
 *   - Optional `animated` prop (default true)
 *
 * CSS animations are defined inline via <style> inside each SVG
 * to keep them self-contained and avoid global CSS pollution.
 * Unique IDs use prefix per icon to avoid SVG gradient ID collisions.
 */

// ========== Service Card Icons ==========

/** Tarot - Crystal Ball with inner swirl and floating sparkles */
export function TarotIcon({ size = 40, className, animated = true }: IconProps) {
  const id = "ti";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        @keyframes ${id}-glow { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes ${id}-twinkle1 { 0%,100% { opacity: 0.3; r: 1; } 50% { opacity: 0.9; r: 1.5; } }
        @keyframes ${id}-twinkle2 { 0%,100% { opacity: 0.5; r: 0.8; } 50% { opacity: 1; r: 1.2; } }
        @keyframes ${id}-swirl { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .${id}-anim, .${id}-tw1, .${id}-tw2, .${id}-sw { animation: none !important; }
        }
      `}</style>
      <defs>
        <radialGradient id={`${id}-ball`} cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#a78bfa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.95" />
        </radialGradient>
        <radialGradient id={`${id}-inner`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-base`} x1="0%" y1="100%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
        <filter id={`${id}-gf`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g className={animated ? `${id}-anim` : ""} style={animated ? { animation: `${id}-float 3s ease-in-out infinite` } : undefined}>
        {/* Base/stand */}
        <ellipse cx="24" cy="40" rx="12" ry="3" fill={`url(#${id}-base)`} opacity="0.7" />
        {/* Crystal ball */}
        <circle cx="24" cy="24" r="14" fill={`url(#${id}-ball)`} filter={`url(#${id}-gf)`} />
        {/* Inner glow */}
        <circle cx="24" cy="24" r="10" fill={`url(#${id}-inner)`}
          className={animated ? `${id}-anim` : ""}
          style={animated ? { animation: `${id}-glow 2.5s ease-in-out infinite` } : undefined} />
        {/* Swirl lines inside */}
        <g style={animated ? { transformOrigin: "24px 24px", animation: `${id}-swirl 12s linear infinite` } : { transformOrigin: "24px 24px" }}
          className={animated ? `${id}-sw` : ""}>
          <path d="M20 20Q24 16 28 20" stroke="#e9d5ff" strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M18 24Q24 28 30 24" stroke="#c4b5fd" strokeWidth="0.6" fill="none" opacity="0.3" />
        </g>
        {/* Highlight */}
        <ellipse cx="20" cy="18" rx="3" ry="2" fill="white" opacity="0.25" transform="rotate(-20 20 18)" />
        {/* Sparkles */}
        <circle cx="34" cy="10" r="1" fill="#fde68a"
          className={animated ? `${id}-tw1` : ""}
          style={animated ? { animation: `${id}-twinkle1 2s ease-in-out infinite` } : undefined} />
        <circle cx="38" cy="18" r="0.8" fill="#fde68a"
          className={animated ? `${id}-tw2` : ""}
          style={animated ? { animation: `${id}-twinkle2 2.5s ease-in-out infinite 0.5s` } : undefined} />
        <circle cx="10" cy="14" r="0.6" fill="#e9d5ff"
          className={animated ? `${id}-tw1` : ""}
          style={animated ? { animation: `${id}-twinkle1 3s ease-in-out infinite 1s` } : undefined} />
      </g>
    </svg>
  );
}

/** BaZi - Yin-Yang with slow rotation and glow pulse */
export function BaZiIcon({ size = 40, className, animated = true }: IconProps) {
  const id = "bi";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes ${id}-pulse { 0%,100% { opacity: 0.15; } 50% { opacity: 0.35; } }
        @keyframes ${id}-ring { 0%,100% { stroke-opacity: 0.3; } 50% { stroke-opacity: 0.6; } }
        @media (prefers-reduced-motion: reduce) {
          .${id}-spin, .${id}-pulse, .${id}-ring { animation: none !important; }
        }
      `}</style>
      <defs>
        <linearGradient id={`${id}-light`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id={`${id}-dark`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#1c0a00" />
        </linearGradient>
        <radialGradient id={`${id}-aura`} cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#f59e0b" stopOpacity="0" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.25" />
        </radialGradient>
        <filter id={`${id}-gf`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Outer aura pulse */}
      <circle cx="24" cy="24" r="22" fill={`url(#${id}-aura)`}
        className={animated ? `${id}-pulse` : ""}
        style={animated ? { animation: `${id}-pulse 3s ease-in-out infinite` } : undefined} />
      {/* Decorative ring */}
      <circle cx="24" cy="24" r="20" fill="none" stroke="#f59e0b" strokeWidth="0.5"
        className={animated ? `${id}-ring` : ""}
        style={animated ? { animation: `${id}-ring 3s ease-in-out infinite` } : undefined} />
      {/* Main yin-yang */}
      <g style={animated ? { transformOrigin: "24px 24px", animation: `${id}-spin 15s linear infinite` } : { transformOrigin: "24px 24px" }}
        className={animated ? `${id}-spin` : ""}>
        <circle cx="24" cy="24" r="16" fill={`url(#${id}-dark)`} stroke="#f59e0b" strokeWidth="1" filter={`url(#${id}-gf)`} />
        <path d="M24 8A16 16 0 0 1 24 40A8 8 0 0 1 24 24A8 8 0 0 0 24 8Z" fill={`url(#${id}-light)`} />
        <circle cx="24" cy="16" r="2.5" fill={`url(#${id}-dark)`} />
        <circle cx="24" cy="32" r="2.5" fill={`url(#${id}-light)`} />
      </g>
    </svg>
  );
}

/** Horoscope - Compass Star with twinkle rays */
export function HoroscopeIcon({ size = 40, className, animated = true }: IconProps) {
  const id = "hi";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-pulse { 0%,100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.05); opacity: 1; } }
        @keyframes ${id}-ray { 0%,100% { opacity: 0.2; } 50% { opacity: 0.5; } }
        @keyframes ${id}-twinkle { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 0.9; transform: scale(1.2); } }
        @media (prefers-reduced-motion: reduce) {
          .${id}-pulse, .${id}-ray, .${id}-tw { animation: none !important; }
        }
      `}</style>
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="40%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <radialGradient id={`${id}-center`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#3b82f6" />
        </radialGradient>
        <filter id={`${id}-gf`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Light rays */}
      {[0, 45, 90, 135].map((angle) => (
        <line key={angle} x1="24" y1="24" x2="24" y2="2"
          stroke="#93c5fd" strokeWidth="0.5"
          transform={`rotate(${angle} 24 24)`}
          className={animated ? `${id}-ray` : ""}
          style={animated ? { animation: `${id}-ray 3s ease-in-out infinite ${angle * 0.02}s` } : undefined} />
      ))}
      {/* Main 4-point star */}
      <g className={animated ? `${id}-pulse` : ""}
        style={animated ? { transformOrigin: "24px 24px", animation: `${id}-pulse 4s ease-in-out infinite` } : { transformOrigin: "24px 24px" }}>
        <path
          d="M24 4L28 18L42 24L28 30L24 44L20 30L6 24L20 18Z"
          fill={`url(#${id}-grad)`}
          filter={`url(#${id}-gf)`}
        />
        {/* 4 small diamond accents */}
        <path d="M24 8L25 11L24 14L23 11Z" fill="#dbeafe" opacity="0.5" />
        <path d="M34 24L37 25L34 26L31 25Z" fill="#dbeafe" opacity="0.5" />
      </g>
      {/* Center jewel */}
      <circle cx="24" cy="24" r="3.5" fill={`url(#${id}-center)`} />
      <circle cx="24" cy="24" r="1.5" fill="white" opacity="0.4" />
      {/* Accent twinkles */}
      <circle cx="10" cy="10" r="1" fill="#93c5fd"
        className={animated ? `${id}-tw` : ""}
        style={animated ? { transformOrigin: "10px 10px", animation: `${id}-twinkle 2.5s ease-in-out infinite` } : undefined} />
      <circle cx="38" cy="38" r="0.8" fill="#93c5fd"
        className={animated ? `${id}-tw` : ""}
        style={animated ? { transformOrigin: "38px 38px", animation: `${id}-twinkle 3s ease-in-out infinite 0.8s` } : undefined} />
      <circle cx="38" cy="10" r="0.6" fill="#bfdbfe"
        className={animated ? `${id}-tw` : ""}
        style={animated ? { transformOrigin: "38px 10px", animation: `${id}-twinkle 2s ease-in-out infinite 1.5s` } : undefined} />
    </svg>
  );
}

/** Dream - Crescent Moon with floating stars and cloud mist */
export function DreamIcon({ size = 40, className, animated = true }: IconProps) {
  const id = "di";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes ${id}-twinkle1 { 0%,100% { opacity: 0.2; } 50% { opacity: 0.9; } }
        @keyframes ${id}-twinkle2 { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes ${id}-mist { 0%,100% { opacity: 0.15; transform: translateX(0); } 50% { opacity: 0.3; transform: translateX(2px); } }
        @media (prefers-reduced-motion: reduce) {
          .${id}-fl, .${id}-tw1, .${id}-tw2, .${id}-mist { animation: none !important; }
        }
      `}</style>
      <defs>
        <linearGradient id={`${id}-moon`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <radialGradient id={`${id}-aura`} cx="30%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-gf`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g className={animated ? `${id}-fl` : ""}
        style={animated ? { animation: `${id}-float 4s ease-in-out infinite` } : undefined}>
        {/* Moon aura */}
        <circle cx="22" cy="22" r="16" fill={`url(#${id}-aura)`} />
        {/* Moon crescent */}
        <path
          d="M28 6C18 6 10 14 10 24C10 34 18 42 28 42C32 42 35.5 40.5 38 38C34 40 29 39 25.5 35.5C22 32 21 27 23 23C25 19 29 17 33 18C31.5 10 28 6 28 6Z"
          fill={`url(#${id}-moon)`}
          filter={`url(#${id}-gf)`}
        />
        {/* Moon surface detail */}
        <circle cx="20" cy="22" r="2" fill="#6366f1" opacity="0.2" />
        <circle cx="26" cy="30" r="1.5" fill="#6366f1" opacity="0.15" />
      </g>
      {/* Stars with twinkle */}
      <path d="M38 10L39 13L42 14L39 15L38 18L37 15L34 14L37 13Z" fill="#e0e7ff"
        className={animated ? `${id}-tw1` : ""}
        style={animated ? { animation: `${id}-twinkle1 2s ease-in-out infinite` } : undefined} />
      <path d="M42 22L42.5 23.5L44 24L42.5 24.5L42 26L41.5 24.5L40 24L41.5 23.5Z" fill="#c7d2fe"
        className={animated ? `${id}-tw2` : ""}
        style={animated ? { animation: `${id}-twinkle2 2.5s ease-in-out infinite 0.5s` } : undefined} />
      <circle cx="36" cy="7" r="0.8" fill="#e0e7ff"
        className={animated ? `${id}-tw1` : ""}
        style={animated ? { animation: `${id}-twinkle1 3s ease-in-out infinite 1s` } : undefined} />
      {/* Cloud mist */}
      <ellipse cx="16" cy="40" rx="8" ry="2.5" fill="#818cf8" opacity="0.15"
        className={animated ? `${id}-mist` : ""}
        style={animated ? { animation: `${id}-mist 5s ease-in-out infinite` } : undefined} />
      <ellipse cx="30" cy="42" rx="6" ry="2" fill="#6366f1" opacity="0.1"
        className={animated ? `${id}-mist` : ""}
        style={animated ? { animation: `${id}-mist 6s ease-in-out infinite 1s` } : undefined} />
    </svg>
  );
}

/** Compatibility - Intertwined Hearts with heartbeat pulse */
export function CompatibilityIcon({ size = 40, className, animated = true }: IconProps) {
  const id = "ci";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-beat { 0%,100% { transform: scale(1); } 15% { transform: scale(1.08); } 30% { transform: scale(1); } 45% { transform: scale(1.04); } 60% { transform: scale(1); } }
        @keyframes ${id}-sparkle { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.3); } }
        @media (prefers-reduced-motion: reduce) {
          .${id}-beat, .${id}-sp { animation: none !important; }
        }
      `}</style>
      <defs>
        <linearGradient id={`${id}-h1`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="50%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id={`${id}-h2`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
        <filter id={`${id}-gf`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g className={animated ? `${id}-beat` : ""}
        style={animated ? { transformOrigin: "24px 24px", animation: `${id}-beat 2s ease-in-out infinite` } : { transformOrigin: "24px 24px" }}>
        {/* Heart 1 (pink-red) */}
        <path
          d="M16 14C12 10 6 10 6 16C6 24 16 30 16 30C16 30 26 24 26 16C26 10 20 10 16 14Z"
          fill={`url(#${id}-h1)`}
          filter={`url(#${id}-gf)`}
          opacity="0.9"
        />
        {/* Heart 2 (purple) - offset */}
        <path
          d="M32 16C28 12 22 12 22 18C22 26 32 32 32 32C32 32 42 26 42 18C42 12 36 12 32 16Z"
          fill={`url(#${id}-h2)`}
          filter={`url(#${id}-gf)`}
          opacity="0.85"
        />
        {/* Heart highlights */}
        <ellipse cx="12" cy="14" rx="2" ry="1.5" fill="white" opacity="0.2" transform="rotate(-30 12 14)" />
        <ellipse cx="28" cy="16" rx="2" ry="1.5" fill="white" opacity="0.15" transform="rotate(-30 28 16)" />
      </g>
      {/* Sparkles between hearts */}
      <circle cx="24" cy="20" r="1.5" fill="#fde68a"
        className={animated ? `${id}-sp` : ""}
        style={animated ? { transformOrigin: "24px 20px", animation: `${id}-sparkle 2s ease-in-out infinite` } : undefined} />
      <circle cx="20" cy="24" r="0.8" fill="#fde68a"
        className={animated ? `${id}-sp` : ""}
        style={animated ? { transformOrigin: "20px 24px", animation: `${id}-sparkle 2.5s ease-in-out infinite 0.5s` } : undefined} />
      <circle cx="28" cy="22" r="0.6" fill="#fbbf24"
        className={animated ? `${id}-sp` : ""}
        style={animated ? { transformOrigin: "28px 22px", animation: `${id}-sparkle 3s ease-in-out infinite 1s` } : undefined} />
    </svg>
  );
}

// ========== Community Section Icons ==========

/** Chat/Share Insights */
export function ChatIcon({ size = 32, className, animated = true }: IconProps) {
  const id = "chi";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-dot { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
        @media (prefers-reduced-motion: reduce) { .${id}-dot { animation: none !important; } }
      `}</style>
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="24" height="17" rx="4" fill={`url(#${id}-g)`} opacity="0.9" />
      <polygon points="10,21 14,21 8,27" fill={`url(#${id}-g)`} opacity="0.7" />
      {[10, 16, 22].map((cx, i) => (
        <circle key={cx} cx={cx} cy="12.5" r="1.5" fill="#78350f" opacity="0.6"
          className={animated ? `${id}-dot` : ""}
          style={animated ? { animation: `${id}-dot 1.5s ease-in-out infinite ${i * 0.2}s` } : undefined} />
      ))}
    </svg>
  );
}

/** Expert Content / Star */
export function ExpertIcon({ size = 32, className, animated = true }: IconProps) {
  const id = "ei";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-shine { 0%,100% { opacity: 0.85; filter: drop-shadow(0 0 2px rgba(251,191,36,0.3)); } 50% { opacity: 1; filter: drop-shadow(0 0 6px rgba(251,191,36,0.6)); } }
        @media (prefers-reduced-motion: reduce) { .${id}-sh { animation: none !important; } }
      `}</style>
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M16 2L19.5 11.5L29 12L22 18.5L24 28L16 23L8 28L10 18.5L3 12L12.5 11.5Z"
        fill={`url(#${id}-g)`}
        className={animated ? `${id}-sh` : ""}
        style={animated ? { animation: `${id}-shine 3s ease-in-out infinite` } : undefined}
      />
      <ellipse cx="16" cy="13" rx="2" ry="1.5" fill="white" opacity="0.2" />
    </svg>
  );
}

/** Interaction / Handshake */
export function InteractionIcon({ size = 32, className, animated = true }: IconProps) {
  const id = "ii";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-wave { 0%,100% { transform: translateX(0); } 50% { transform: translateX(1px); } }
        @media (prefers-reduced-motion: reduce) { .${id}-w { animation: none !important; } }
      `}</style>
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="11" cy="10" r="4" fill={`url(#${id}-g)`} opacity="0.9" />
      <circle cx="21" cy="10" r="4" fill={`url(#${id}-g)`} opacity="0.9" />
      <path d="M4 26C4 20 7 17 11 17C13 17 14.5 17.5 16 19C17.5 17.5 19 17 21 17C25 17 28 20 28 26"
        stroke={`url(#${id}-g)`} strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M13 14C14.5 15.5 17.5 15.5 19 14" stroke="#fde68a" strokeWidth="1.5" fill="none" opacity="0.5"
        className={animated ? `${id}-w` : ""}
        style={animated ? { animation: `${id}-wave 2s ease-in-out infinite` } : undefined} />
    </svg>
  );
}

/** Growth Check-in / Target */
export function GrowthIcon({ size = 32, className, animated = true }: IconProps) {
  const id = "gi";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-ring { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @media (prefers-reduced-motion: reduce) { .${id}-r { animation: none !important; } }
      `}</style>
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" stroke={`url(#${id}-g)`} strokeWidth="2" fill="none"
        className={animated ? `${id}-r` : ""}
        style={animated ? { animation: `${id}-ring 3s ease-in-out infinite` } : undefined} />
      <circle cx="16" cy="16" r="9" stroke={`url(#${id}-g)`} strokeWidth="2" fill="none"
        className={animated ? `${id}-r` : ""}
        style={animated ? { animation: `${id}-ring 3s ease-in-out infinite 0.5s` } : undefined} />
      <circle cx="16" cy="16" r="5" fill={`url(#${id}-g)`} opacity="0.9" />
      <line x1="26" y1="6" x2="18" y2="14" stroke="#fde68a" strokeWidth="1.5" opacity="0.7" />
      <path d="M24 4L28 5L27 9" stroke="#fde68a" strokeWidth="1.5" fill="none" opacity="0.7" />
    </svg>
  );
}

// ========== Testimonial Avatar Icons ==========

/** Heart avatar for testimonial */
export function TestimonialHeartIcon({ size = 36, className, animated = true }: IconProps) {
  const id = "thi";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-glow { 0%,100% { stroke-opacity: 0.5; } 50% { stroke-opacity: 0.9; } }
        @media (prefers-reduced-motion: reduce) { .${id}-gl { animation: none !important; } }
      `}</style>
      <circle cx="18" cy="18" r="17" fill="#1a0a1e" stroke="#f472b6" strokeWidth="1"
        className={animated ? `${id}-gl` : ""}
        style={animated ? { animation: `${id}-glow 3s ease-in-out infinite` } : undefined} />
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
      </defs>
      <path
        d="M18 14C16 11 12 11 12 14.5C12 19 18 23 18 23C18 23 24 19 24 14.5C24 11 20 11 18 14Z"
        fill={`url(#${id}-g)`}
      />
    </svg>
  );
}

/** Moon avatar for testimonial */
export function TestimonialMoonIcon({ size = 36, className, animated = true }: IconProps) {
  const id = "tmi";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-glow { 0%,100% { stroke-opacity: 0.5; } 50% { stroke-opacity: 0.9; } }
        @media (prefers-reduced-motion: reduce) { .${id}-gl { animation: none !important; } }
      `}</style>
      <circle cx="18" cy="18" r="17" fill="#0f1225" stroke="#fbbf24" strokeWidth="1"
        className={animated ? `${id}-gl` : ""}
        style={animated ? { animation: `${id}-glow 3s ease-in-out infinite` } : undefined} />
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M20 10C15 10 11 14 11 19C11 24 15 28 20 28C22 28 23.5 27.5 25 26C22 27.5 19 26.5 17 24C15 21.5 14.5 18 16 15.5C17.5 13 20 12 22.5 12.5C22 11 20 10 20 10Z"
        fill={`url(#${id}-g)`}
      />
    </svg>
  );
}

/** Sparkle avatar for testimonial */
export function TestimonialSparkleIcon({ size = 36, className, animated = true }: IconProps) {
  const id = "tsi";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-glow { 0%,100% { stroke-opacity: 0.5; } 50% { stroke-opacity: 0.9; } }
        @keyframes ${id}-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .${id}-gl, .${id}-sp { animation: none !important; } }
      `}</style>
      <circle cx="18" cy="18" r="17" fill="#0f0a1e" stroke="#a78bfa" strokeWidth="1"
        className={animated ? `${id}-gl` : ""}
        style={animated ? { animation: `${id}-glow 3s ease-in-out infinite` } : undefined} />
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <g style={animated ? { transformOrigin: "18px 18px", animation: `${id}-spin 20s linear infinite` } : { transformOrigin: "18px 18px" }}
        className={animated ? `${id}-sp` : ""}>
        <path d="M18 8L20 15L27 18L20 21L18 28L16 21L9 18L16 15Z" fill={`url(#${id}-g)`} />
      </g>
      <circle cx="18" cy="18" r="2" fill="#e9d5ff" opacity="0.7" />
    </svg>
  );
}

// ========== Utility Icons ==========

/** Lightning bolt for AI-Powered */
export function LightningIcon({ size = 32, className, animated = true }: IconProps) {
  const id = "li";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-flash { 0%,100% { opacity: 0.85; } 50% { opacity: 1; filter: drop-shadow(0 0 4px rgba(251,191,36,0.5)); } }
        @media (prefers-reduced-motion: reduce) { .${id}-fl { animation: none !important; } }
      `}</style>
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path d="M18 2L8 18H15L13 30L24 14H17Z" fill={`url(#${id}-g)`}
        className={animated ? `${id}-fl` : ""}
        style={animated ? { animation: `${id}-flash 2s ease-in-out infinite` } : undefined} />
    </svg>
  );
}

/** Shield for Scientific Approach */
export function ShieldIcon({ size = 32, className, animated = true }: IconProps) {
  const id = "si";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M16 3L5 8V15C5 22.5 9.5 28.5 16 30C22.5 28.5 27 22.5 27 15V8L16 3Z"
        fill="none" stroke={`url(#${id}-g)`} strokeWidth="2" opacity="0.9"
      />
      <path d="M12 16L15 19L21 13" stroke={`url(#${id}-g)`} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Heart for Charity */
export function CharityHeartIcon({ size = 32, className, animated = true }: IconProps) {
  const id = "ch";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ${id}-beat { 0%,100% { transform: scale(1); } 15% { transform: scale(1.06); } 30% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .${id}-bt { animation: none !important; } }
      `}</style>
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <g className={animated ? `${id}-bt` : ""}
        style={animated ? { transformOrigin: "16px 16px", animation: `${id}-beat 2.5s ease-in-out infinite` } : { transformOrigin: "16px 16px" }}>
        <path
          d="M16 10C14 6 8 6 8 11C8 18 16 24 16 24C16 24 24 18 24 11C24 6 18 6 16 10Z"
          fill={`url(#${id}-g)`} opacity="0.9"
        />
        <path d="M10 22C12 24 14 25 16 26C18 25 20 24 22 22" stroke={`url(#${id}-g)`} strokeWidth="1.5" fill="none" opacity="0.5" />
      </g>
    </svg>
  );
}
