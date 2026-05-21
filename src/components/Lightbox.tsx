import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxPhoto = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  creditUrl: string;
  source: string;
};

interface Props {
  photos: LightboxPhoto[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}

export function Lightbox({ photos, index, onClose, onIndex }: Props) {
  const p = photos[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndex((index - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight") onIndex((index + 1) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, photos.length, onClose, onIndex]);

  if (!p) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white"
        aria-label="Close"
      >
        <X className="size-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + photos.length) % photos.length); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white"
        aria-label="Previous"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % photos.length); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white"
        aria-label="Next"
      >
        <ChevronRight className="size-6" />
      </button>
      <div className="flex-1 flex items-center justify-center p-6 pb-2" onClick={(e) => e.stopPropagation()}>
        <img src={p.src} alt={p.alt} className="max-h-full max-w-full object-contain" />
      </div>
      <div
        className="px-6 pb-6 pt-2 text-center text-sm text-white/90 max-w-3xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>{p.caption}</div>
        <div className="text-xs text-white/60 mt-1">
          Photo:{" "}
          <a href={p.creditUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">
            {p.credit}
          </a>{" "}
          on {p.source} · {index + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
}

export function useLightbox() {
  const [open, setOpen] = useState<{ photos: LightboxPhoto[]; index: number } | null>(null);
  return {
    open: (photos: LightboxPhoto[], index: number) => setOpen({ photos, index }),
    close: () => setOpen(null),
    setIndex: (i: number) => setOpen((s) => (s ? { ...s, index: i } : s)),
    state: open,
  };
}
