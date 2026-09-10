import { TimelineCard } from "@/components/timeline/timeline-card";
import type { TimelineItem } from "@/generated/prisma/client";

export function VerticalTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="block space-y-6 sm:hidden">
      {items.map((item) => (
        <div key={item.id} className="relative pl-6">
          <div className="absolute left-0 top-2 h-3 w-3 rounded-full bg-primary" />
          <div className="absolute left-[5px] top-5 bottom-[-24px] w-px bg-border last:hidden" />
          <TimelineCard item={item} />
        </div>
      ))}
    </div>
  );
}
