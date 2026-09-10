import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/dates";
import { TIMELINE_TYPE_LABELS } from "@/lib/timeline-types";
import { TimelineItemRowActions } from "@/components/admin/timeline-item-row-actions";

export default async function AdminTimelinePage() {
  const items = await prisma.timelineItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Timeline</h1>
        <Button nativeButton={false} render={<Link href="/admin/timeline/new" />}>
          Novo item
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum item ainda. Clique em &quot;Novo item&quot; para começar.
        </p>
      ) : (
        <div className="divide-y rounded-lg border bg-background">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{TIMELINE_TYPE_LABELS[item.type]}</Badge>
                  <p className="truncate font-medium">{item.title}</p>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {item.subtitle ? `${item.subtitle} · ` : ""}
                  {formatDateRange(item.startDate, item.endDate)}
                </p>
              </div>
              <TimelineItemRowActions
                id={item.id}
                isFirst={index === 0}
                isLast={index === items.length - 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
