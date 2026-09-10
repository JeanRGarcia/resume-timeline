import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/dates";
import { TIMELINE_TYPE_LABELS } from "@/lib/timeline-types";
import type { Appearance } from "@/lib/appearance";
import type { TimelineItem } from "@/generated/prisma/client";

const badgeClassName = "border-current/20 bg-current/10 text-current";

export function TimelineCard({
  item,
  appearance,
}: {
  item: TimelineItem;
  appearance?: Appearance;
}) {
  // Without an explicit card color, default to a translucent card that contrasts
  // with whichever text color (black/white) the page is using.
  const defaultCardBackground =
    appearance?.textColor === "white" ? "rgba(15, 15, 15, 0.55)" : "rgba(255, 255, 255, 0.85)";

  return (
    <div
      className="w-72 rounded-xl border border-current/10 p-4 shadow-sm backdrop-blur-sm sm:w-80"
      style={{ backgroundColor: appearance?.cardBackgroundColor || defaultCardBackground }}
    >
      {item.imageUrl && (
        <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-current/5">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="320px"
          />
        </div>
      )}
      <Badge variant="secondary" className={`mb-2 ${badgeClassName}`}>
        {TIMELINE_TYPE_LABELS[item.type]}
      </Badge>
      <h3 className="text-base font-semibold leading-tight">{item.title}</h3>
      {item.subtitle && <p className="text-sm opacity-80">{item.subtitle}</p>}
      <p className="mt-1 text-xs opacity-70">
        {formatDateRange(item.startDate, item.endDate)}
        {item.location ? ` · ${item.location}` : ""}
      </p>
      {item.description && (
        <p className="mt-2 line-clamp-4 text-sm opacity-80">{item.description}</p>
      )}
      {item.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.skills.map((skill) => (
            <Badge key={skill} variant="outline" className={`text-xs ${badgeClassName}`}>
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
