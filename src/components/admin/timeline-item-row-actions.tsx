"use client";

import { useTransition } from "react";
import { ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteTimelineItem, moveTimelineItem } from "@/actions/timeline";
import { Button } from "@/components/ui/button";

export function TimelineItemRowActions({
  id,
  isFirst,
  isLast,
}: {
  id: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Remover este item da timeline?")) return;
    startTransition(async () => {
      await deleteTimelineItem(id);
      toast.success("Item removido.");
    });
  }

  function handleMove(direction: "up" | "down") {
    startTransition(() => moveTimelineItem(id, direction));
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isFirst || isPending}
        onClick={() => handleMove("up")}
        aria-label="Mover para cima"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isLast || isPending}
        onClick={() => handleMove("down")}
        aria-label="Mover para baixo"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        nativeButton={false}
        render={<Link href={`/admin/timeline/${id}`} aria-label="Editar" />}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isPending}
        onClick={handleDelete}
        aria-label="Remover"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
