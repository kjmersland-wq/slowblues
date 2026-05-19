import type { UnsplashPhoto } from "@/lib/unsplash.functions";

type Props = {
  photo: UnsplashPhoto;
  size?: keyof UnsplashPhoto["urls"];
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  rounded?: boolean;
};

/**
 * Renders an Unsplash photo with mandatory attribution overlay
 * (per Unsplash API guidelines). Pass `priority` for above-the-fold heroes.
 */
export function UnsplashImage({
  photo,
  size = "regular",
  className,
  imgClassName,
  priority,
  rounded = true,
}: Props) {
  return (
    <figure
      className={`relative overflow-hidden ${rounded ? "rounded-lg" : ""} ${className ?? ""}`}
      style={{ backgroundColor: photo.color }}
    >
      <img
        src={photo.urls[size]}
        alt={photo.altDescription ?? photo.description ?? `Photo by ${photo.user.name}`}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`block w-full h-full object-cover ${imgClassName ?? ""}`}
      />
      <UnsplashCredit photo={photo} />
    </figure>
  );
}

export function UnsplashCredit({ photo, position = "br" }: { photo: UnsplashPhoto; position?: "br" | "bl" }) {
  const pos = position === "bl" ? "left-2" : "right-2";
  return (
    <figcaption
      className={`absolute bottom-2 ${pos} z-10 rounded bg-black/55 backdrop-blur-sm px-2 py-1 text-[10px] leading-tight text-white/90`}
    >
      Photo by{" "}
      <a
        href={photo.user.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-gold/60 hover:text-white"
      >
        {photo.user.name}
      </a>{" "}
      on{" "}
      <a
        href={photo.links.html}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-gold/60 hover:text-white"
      >
        Unsplash
      </a>
    </figcaption>
  );
}
