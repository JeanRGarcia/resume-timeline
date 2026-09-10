import { HorizontalTimeline } from "@/components/timeline/horizontal-timeline";
import { VerticalTimeline } from "@/components/timeline/vertical-timeline";
import type { TimelineItem } from "@/generated/prisma/client";

export function Timeline({ items }: { items: TimelineItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Nenhum item na timeline ainda. Adicione o primeiro no painel /admin.
      </p>
    );
  }

  return (
    <>
      <HorizontalTimeline items={items} />
      <VerticalTimeline items={items} />
    </>
  );
}
