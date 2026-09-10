"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { TimelineFormState } from "@/actions/timeline";
import { ImageUploadField } from "@/components/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { TIMELINE_TYPE_OPTIONS } from "@/lib/timeline-types";
import type { TimelineItem } from "@/generated/prisma/client";

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function TimelineItemForm({
  item,
  action,
  submitLabel,
}: {
  item?: TimelineItem;
  action: (state: TimelineFormState, formData: FormData) => Promise<TimelineFormState>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="type">Tipo</Label>
            <select
              id="type"
              name="type"
              defaultValue={item?.type ?? "EXPERIENCE"}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            >
              {TIMELINE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" name="title" defaultValue={item?.title} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subtitle">Empresa / Instituição</Label>
            <Input id="subtitle" name="subtitle" defaultValue={item?.subtitle ?? ""} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Data de início *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={toDateInputValue(item?.startDate)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">Data de fim</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={toDateInputValue(item?.endDate)}
              />
              <p className="text-xs text-muted-foreground">Deixe em branco para &quot;Presente&quot;.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Localização</Label>
            <Input id="location" name="location" defaultValue={item?.location ?? ""} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" name="description" rows={4} defaultValue={item?.description ?? ""} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skills">Habilidades / tags (separadas por vírgula)</Label>
            <Input
              id="skills"
              name="skills"
              placeholder="React, TypeScript, Liderança"
              defaultValue={item?.skills.join(", ") ?? ""}
            />
          </div>

          <ImageUploadField name="imageUrl" label="Imagem" defaultValue={item?.imageUrl} />

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando…" : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
