"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/dates";
import { TIMELINE_TYPE_LABELS } from "@/lib/timeline-types";
import { getCardBackground, DEFAULT_APPEARANCE, type Appearance } from "@/lib/appearance";
import type { TimelineItem } from "@/generated/prisma/client";

const badgeClassName = "border-current/20 bg-current/10 text-current";

/** True while the element's text is being cut off by a line-clamp. */
function useIsClamped<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [clamped, setClamped] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setClamped(el.scrollHeight - el.clientHeight > 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, clamped] as const;
}

export function TimelineCard({
  item,
  appearance = DEFAULT_APPEARANCE,
  uniformHeight = true,
}: {
  item: TimelineItem;
  appearance?: Appearance;
  /** Same collapsed height for every card (needed by the horizontal timeline). */
  uniformHeight?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [titleRef, titleClamped] = useIsClamped<HTMLHeadingElement>();
  const [subtitleRef, subtitleClamped] = useIsClamped<HTMLParagraphElement>();
  const [descriptionRef, descriptionClamped] = useIsClamped<HTMLParagraphElement>();

  // While expanded nothing is clamped, so keep the toggle visible to collapse again.
  const canExpand =
    expanded || titleClamped || subtitleClamped || descriptionClamped || item.skills.length > 0;

  return (
    <div
      className={`flex w-72 flex-col rounded-xl border border-current/10 p-4 shadow-sm backdrop-blur-sm sm:w-80 ${
        uniformHeight
          ? expanded
            ? "min-h-64 lg:min-h-[18.5rem]"
            : "h-64 lg:h-[18.5rem]"
          : ""
      }`}
      style={{ backgroundColor: getCardBackground(appearance) }}
    >
      {expanded && item.imageUrl && (
        <div className="relative mb-3 h-36 w-full shrink-0 overflow-hidden rounded-lg bg-current/5">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="320px"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge variant="secondary" className={`mb-2 ${badgeClassName}`}>
            {TIMELINE_TYPE_LABELS[item.type]}
          </Badge>
          <h3
            ref={titleRef}
            className={`text-base font-semibold leading-tight ${expanded ? "" : "line-clamp-2"}`}
          >
            {item.title}
          </h3>
          {item.subtitle && (
            <p
              ref={subtitleRef}
              className={`text-sm opacity-80 ${expanded ? "" : "line-clamp-1"}`}
            >
              {item.subtitle}
            </p>
          )}
          <p className={`mt-1 text-xs opacity-70 ${expanded ? "" : "truncate"}`}>
            {formatDateRange(item.startDate, item.endDate)}
            {item.location ? ` · ${item.location}` : ""}
          </p>
        </div>

        {!expanded && item.imageUrl && (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-current/5">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        )}
      </div>

      {item.description && (
        <p
          ref={descriptionRef}
          className={`mt-2 whitespace-pre-line text-sm opacity-80 ${expanded ? "" : "line-clamp-4 lg:line-clamp-6"}`}
        >
          {item.description}
        </p>
      )}

      {expanded && item.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.skills.map((skill) => (
            <Badge key={skill} variant="outline" className={`text-xs ${badgeClassName}`}>
              {skill}
            </Badge>
          ))}
        </div>
      )}

      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-auto self-start pt-2 text-xs font-medium opacity-80 underline-offset-2 hover:underline hover:opacity-100"
        >
          {expanded ? "Mostrar menos" : "Mostrar mais"}
        </button>
      )}
    </div>
  );
}
