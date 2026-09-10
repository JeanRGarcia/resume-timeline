import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TimelineItemForm } from "@/components/admin/timeline-item-form";
import { updateTimelineItem } from "@/actions/timeline";

export default async function EditTimelineItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.timelineItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Editar item</h1>
      <TimelineItemForm
        item={item}
        action={updateTimelineItem.bind(null, id)}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
