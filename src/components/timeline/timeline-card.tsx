import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/dates";
import { TIMELINE_TYPE_LABELS } from "@/lib/timeline-types";
import type { TimelineItem } from "@/generated/prisma/client";

export function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <div className="w-72 rounded-xl border bg-card p-4 shadow-sm sm:w-80">
      {item.imageUrl && (
        <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="320px"
          />
        </div>
      )}
      <Badge variant="secondary" className="mb-2">
        {TIMELINE_TYPE_LABELS[item.type]}
      </Badge>
      <h3 className="text-base font-semibold leading-tight">{item.title}</h3>
      {item.subtitle && (
        <p className="text-sm text-muted-foreground">{item.subtitle}</p>
      )}
      <p className="mt-1 text-xs text-muted-foreground">
        {formatDateRange(item.startDate, item.endDate)}
        {item.location ? ` · ${item.location}` : ""}
      </p>
      {item.description && (
        <p className="mt-2 line-clamp-4 text-sm text-foreground/80">
          {item.description}
        </p>
      )}
      {item.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
