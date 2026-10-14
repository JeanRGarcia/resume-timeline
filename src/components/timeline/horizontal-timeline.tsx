"use client";

import { Fragment, useRef, type RefObject, type UIEvent, type WheelEvent } from "react";
import { motion } from "framer-motion";
import { TimelineCard } from "@/components/timeline/timeline-card";
import type { Appearance } from "@/lib/appearance";
import type { TimelineItem } from "@/generated/prisma/client";

const ITEM_WIDTH = 340;

export function HorizontalTimeline({
  items,
  appearance,
  bgRef,
}: {
  items: TimelineItem[];
  appearance: Appearance;
  bgRef?: RefObject<HTMLDivElement | null>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function syncBackground(scrollLeft: number) {
    if (bgRef?.current) {
      bgRef.current.style.backgroundPositionX = `${-scrollLeft}px`;
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    el.scrollLeft += event.deltaY;
    event.preventDefault();
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    syncBackground(event.currentTarget.scrollLeft);
  }

  return (
    <div
      ref={scrollRef}
      onWheel={handleWheel}
      onScroll={handleScroll}
      className="hidden overflow-x-auto pb-6 pt-2 sm:block [scrollbar-width:thin]"
    >
      {/*
        Three grid rows: cards above, the line with the dots, cards below. The dots live
        in their own row, so a taller (or expanded) card only grows its own row and can
        never push a dot off the line. Each row is as tall as its tallest card.
      */}
      <div
        className="grid w-max px-10"
        style={{ gridTemplateColumns: `repeat(${items.length}, ${ITEM_WIDTH}px)` }}
      >
        <div
          className="pointer-events-none -mx-10 h-px self-center bg-current opacity-20"
          style={{ gridRow: 2, gridColumn: "1 / -1" }}
        />
        {items.map((item, index) => {
          const isTop = index % 2 === 0;
          const column = index + 1;
          return (
            <Fragment key={item.id}>
              <div
                className={`flex justify-center ${isTop ? "items-end pb-6" : "items-start pt-6"}`}
                style={{ gridRow: isTop ? 1 : 3, gridColumn: column }}
              >
                <motion.div
                  initial={{ opacity: 0, y: isTop ? 16 : -16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px -80px 0px -80px" }}
                  transition={{ duration: 0.4 }}
                >
                  <TimelineCard item={item} appearance={appearance} />
                </motion.div>
              </div>

              <div
                className="relative z-10 flex justify-center"
                style={{ gridRow: 2, gridColumn: column }}
              >
                <div className="h-4 w-4 rounded-full bg-current shadow" />
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
