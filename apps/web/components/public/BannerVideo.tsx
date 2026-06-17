"use client";

import { useEffect, useRef } from "react";
import { PUBLIC_SITE } from "@/lib/public-site-legacy";

/**
 * Full-bleed background banner video for the public home splash.
 * - Muted + looped + inline so mobile browsers allow autoplay.
 * - Honors prefers-reduced-motion: holds on the poster frame, no playback.
 * - Decorative only (aria-hidden); the hero text carries the meaning.
 */
export function BannerVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!reduceMotion) {
      video.play().catch(() => {
        /* autoplay can be blocked — poster frame remains, which is fine */
      });
    }
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="auto"
      poster={PUBLIC_SITE.assets.heroPoster}
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={PUBLIC_SITE.assets.heroVideo} type="video/mp4" />
    </video>
  );
}
