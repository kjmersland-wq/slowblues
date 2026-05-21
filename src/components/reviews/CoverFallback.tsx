import { Disc3 } from "lucide-react";

type Props = {
  artist: string;
  title: string;
  className?: string;
};

export function CoverFallback({ artist, title, className }: Props) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900 ${className ?? ""}`}
    >
      <Disc3 className="absolute size-3/4 text-gold/10" strokeWidth={1} />
      <div className="relative z-10 px-4 text-center">
        <div className="font-display gold-gradient-text text-xl md:text-2xl leading-tight line-clamp-3">
          {title}
        </div>
        <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {artist}
        </div>
      </div>
    </div>
  );
}
