"use client";

import { useRef, type WheelEvent } from "react";
import { motion } from "framer-motion";
import { TimelineCard } from "@/components/timeline/timeline-card";
import type { TimelineItem } from "@/generated/prisma/client";

const ITEM_WIDTH = 340;

export function HorizontalTimeline({ items }: { items: TimelineItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    el.scrollLeft += event.deltaY;
    event.preventDefault();
  }

  return (
    <div
      ref={scrollRef}
      onWheel={handleWheel}
      className="hidden overflow-x-auto pb-6 pt-2 sm:block [scrollbar-width:thin]"
    >
      <div className="relative flex h-[420px] w-max px-10">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        {items.map((item, index) => {
          const isTop = index % 2 === 0;
          return (
            <div
              key={item.id}
              className="relative flex h-full flex-shrink-0 flex-col items-center"
              style={{ width: ITEM_WIDTH }}
            >
              <div
                className={
                  isTop
                    ? "flex flex-1 items-end justify-center pb-6"
                    : "flex-1"
                }
              >
                {isTop && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px -80px 0px -80px" }}
                    transition={{ duration: 0.4 }}
                  >
                    <TimelineCard item={item} />
                  </motion.div>
                )}
              </div>

              <div className="relative z-10 h-4 w-4 flex-shrink-0 rounded-full border-4 border-background bg-primary shadow" />

              <div
                className={
                  !isTop
                    ? "flex flex-1 items-start justify-center pt-6"
                    : "flex-1"
                }
              >
                {!isTop && (
                  <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px -80px 0px -80px" }}
                    transition={{ duration: 0.4 }}
                  >
                    <TimelineCard item={item} />
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
