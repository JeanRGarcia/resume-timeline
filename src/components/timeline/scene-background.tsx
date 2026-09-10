"use client";

import { forwardRef } from "react";
import type { Appearance } from "@/lib/appearance";

/**
 * Full-page fixed backdrop (color and/or image). Kept as its own fixed layer,
 * independent of page height, so it always covers edge to edge. Its
 * background-position-x is updated imperatively (via `ref`) by the horizontal
 * timeline's scroll handler, so the scene moves together with the timeline —
 * sidescroller-style — without re-rendering React on every scroll tick.
 */
export const SceneBackground = forwardRef<HTMLDivElement, { appearance: Appearance }>(
  function SceneBackground({ appearance }, ref) {
    if (!appearance.backgroundColor && !appearance.backgroundImageUrl) return null;

    return (
      <div
        ref={ref}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundColor: appearance.backgroundColor ?? undefined,
          backgroundImage: appearance.backgroundImageUrl
            ? `url(${appearance.backgroundImageUrl})`
            : undefined,
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "left top",
        }}
      />
    );
  }
);
