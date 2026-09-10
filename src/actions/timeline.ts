"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseDateInput } from "@/lib/dates";
import { TimelineItemType } from "@/generated/prisma/enums";

const timelineItemSchema = z.object({
  type: z.enum(TimelineItemType),
  title: z.string().min(1, "Título é obrigatório"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional(),
  skills: z.string().optional(),
});

function parseSkills(skills: string | undefined): string[] {
  if (!skills) return [];
  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export type TimelineFormState = { error?: string } | undefined;

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Não autorizado.");
}

export async function createTimelineItem(
  _prevState: TimelineFormState,
  formData: FormData
): Promise<TimelineFormState> {
  await requireAuth();

  const parsed = timelineItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const maxOrder = await prisma.timelineItem.aggregate({
    _max: { sortOrder: true },
  });

  await prisma.timelineItem.create({
    data: {
      type: parsed.data.type,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle || null,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      imageUrl: parsed.data.imageUrl || null,
      startDate: parseDateInput(parsed.data.startDate),
      endDate: parsed.data.endDate ? parseDateInput(parsed.data.endDate) : null,
      skills: parseSkills(parsed.data.skills),
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/timeline");
  redirect("/admin/timeline");
}

export async function updateTimelineItem(
  id: string,
  _prevState: TimelineFormState,
  formData: FormData
): Promise<TimelineFormState> {
  await requireAuth();

  const parsed = timelineItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.timelineItem.update({
    where: { id },
    data: {
      type: parsed.data.type,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle || null,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      imageUrl: parsed.data.imageUrl || null,
      startDate: parseDateInput(parsed.data.startDate),
      endDate: parsed.data.endDate ? parseDateInput(parsed.data.endDate) : null,
      skills: parseSkills(parsed.data.skills),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/timeline");
  redirect("/admin/timeline");
}

export async function deleteTimelineItem(id: string) {
  await requireAuth();
  await prisma.timelineItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/timeline");
}

export async function moveTimelineItem(id: string, direction: "up" | "down") {
  await requireAuth();

  const items = await prisma.timelineItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swapWith = items[swapIndex];

  await prisma.$transaction([
    prisma.timelineItem.update({
      where: { id: current.id },
      data: { sortOrder: swapWith.sortOrder },
    }),
    prisma.timelineItem.update({
      where: { id: swapWith.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/timeline");
}
