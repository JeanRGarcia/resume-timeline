import { HorizontalTimeline } from "@/components/timeline/horizontal-timeline";
import { VerticalTimeline } from "@/components/timeline/vertical-timeline";
import type { Appearance } from "@/lib/appearance";
import type { TimelineItem } from "@/generated/prisma/client";

export function Timeline({
  items,
  appearance,
}: {
  items: TimelineItem[];
  appearance: Appearance;
}) {
  if (items.length === 0) {
    return (
      <p className="px-4 py-12 text-center text-sm opacity-70 sm:px-8">
        Nenhum item na timeline ainda. Adicione o primeiro no painel /admin.
      </p>
    );
  }

  return (
    <>
      <HorizontalTimeline items={items} appearance={appearance} />
      <VerticalTimeline items={items} appearance={appearance} />
    </>
  );
}
