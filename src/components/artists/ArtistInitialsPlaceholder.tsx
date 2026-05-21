interface Props {
  name: string;
  className?: string;
}

/**
 * Styled placeholder for artists without a verified photo.
 * Gold serif initials over a deep burgundy → near-black radial gradient.
 * Looks intentional, never a grey empty box.
 */
export function ArtistInitialsPlaceholder({ name, className }: Props) {
  const initials = name
    .replace(/["'’`]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      role="img"
      aria-label={name}
      className={`relative flex items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{
        background:
          "radial-gradient(ellipse at 30% 25%, oklch(0.32 0.08 25) 0%, oklch(0.18 0.04 25) 45%, oklch(0.08 0.02 25) 100%)",
      }}
    >
      <span
        className="font-display select-none"
        style={{
          color: "#c9a84c",
          fontSize: "clamp(2.5rem, 18cqi, 7rem)",
          letterSpacing: "0.08em",
          textShadow: "0 2px 16px rgba(0,0,0,0.5)",
          containerType: "inline-size",
        }}
      >
        {initials || "♪"}
      </span>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 2px, rgba(255,255,255,0.4) 2px 3px)",
        }}
      />
    </div>
  );
}
