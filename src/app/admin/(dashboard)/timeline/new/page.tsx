import { TimelineItemForm } from "@/components/admin/timeline-item-form";
import { createTimelineItem } from "@/actions/timeline";

export default function NewTimelineItemPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Novo item da timeline</h1>
      <TimelineItemForm action={createTimelineItem} submitLabel="Criar item" />
    </div>
  );
}
