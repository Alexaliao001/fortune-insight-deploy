import { useEffect, useId, useRef, useState } from "react";
import { Palette, Check, X, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  HOME_VARIANT_META,
  type HomeVariantId,
} from "@/lib/homeVariant";

interface HomeVariantPickerProps {
  value: HomeVariantId;
  onChange: (id: HomeVariantId) => void;
}

export default function HomeVariantPicker({ value, onChange }: HomeVariantPickerProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(t) &&
        buttonRef.current &&
        !buttonRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div
      className="fixed z-[60] bottom-20 right-3 md:bottom-6 md:right-6"
      data-home-variant-picker
    >
      <button
        ref={buttonRef}
        type="button"
        className="flex items-center gap-2 rounded-full border border-[rgba(212,168,67,0.35)] bg-[#12152a]/95 px-3.5 py-2.5 text-sm font-medium text-[#d4a843] shadow-lg shadow-black/40 backdrop-blur-md hover:bg-[#1a1f38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]/60"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
      >
        <Palette className="w-4 h-4" aria-hidden />
        <span>{isEn ? "Style" : "外观"}</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={isEn ? "Homepage style" : "主页外观"}
          className="absolute bottom-full right-0 mb-2 w-[min(100vw-1.5rem,20rem)] rounded-2xl border border-white/10 bg-[#0f1224]/98 p-3 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-xs font-semibold tracking-wide text-[#d4a843]">
              {isEn ? "Choose a look" : "选择外观"}
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]/50"
              aria-label={isEn ? "Close" : "关闭"}
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-1.5 max-h-[min(60vh,22rem)] overflow-y-auto" role="listbox" aria-label={isEn ? "Variants" : "版本"}>
            {HOME_VARIANT_META.map((meta) => {
              const selected = meta.id === value;
              const label = isEn ? meta.labelEn : meta.labelZh;
              const blurb = isEn ? meta.blurbEn : meta.blurbZh;
              return (
                <li key={meta.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`w-full text-left rounded-xl px-3 py-2.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]/50 ${
                      selected
                        ? "border-[#d4a843]/50 bg-[rgba(212,168,67,0.12)]"
                        : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                    onClick={() => {
                      onChange(meta.id);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm text-foreground flex items-center gap-1.5">
                        {label}
                        {meta.recommended && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(212,168,67,0.18)] text-[#d4a843] border border-[rgba(212,168,67,0.25)]">
                            <Sparkles className="w-2.5 h-2.5" />
                            {isEn ? "Recommended" : "推荐"}
                          </span>
                        )}
                      </span>
                      {selected && <Check className="w-4 h-4 text-[#d4a843] shrink-0" aria-hidden />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{blurb}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
