"use client";

import { useRef } from "react";
import { HorizontalTimeline } from "@/components/timeline/horizontal-timeline";
import { VerticalTimeline } from "@/components/timeline/vertical-timeline";
import { SceneBackground } from "@/components/timeline/scene-background";
import type { Appearance } from "@/lib/appearance";
import type { TimelineItem } from "@/generated/prisma/client";

export function Timeline({
  items,
  appearance,
}: {
  items: TimelineItem[];
  appearance: Appearance;
}) {
  const bgRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <SceneBackground ref={bgRef} appearance={appearance} />
      {items.length === 0 ? (
        <p className="px-4 py-12 text-center text-sm opacity-70 sm:px-8">
          Nenhum item na timeline ainda. Adicione o primeiro no painel /admin.
        </p>
      ) : (
        <>
          <HorizontalTimeline items={items} appearance={appearance} bgRef={bgRef} />
          <VerticalTimeline items={items} appearance={appearance} />
        </>
      )}
    </>
  );
}
