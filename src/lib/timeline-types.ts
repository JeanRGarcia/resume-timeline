import type { TimelineItemType } from "@/generated/prisma/enums";

export const TIMELINE_TYPE_LABELS: Record<TimelineItemType, string> = {
  EXPERIENCE: "Experiência",
  EDUCATION: "Formação",
  PROJECT: "Projeto",
  CERTIFICATION: "Certificação",
  OTHER: "Outro",
};

export const TIMELINE_TYPE_OPTIONS = Object.entries(TIMELINE_TYPE_LABELS).map(
  ([value, label]) => ({ value: value as TimelineItemType, label })
);
