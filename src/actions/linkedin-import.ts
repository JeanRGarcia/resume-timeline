"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseLinkedInZip, type ParsedLinkedInData } from "@/lib/linkedin-import";

export async function parseLinkedInExport(
  formData: FormData
): Promise<ParsedLinkedInData | { error: string }> {
  const session = await auth();
  if (!session?.user) return { error: "Não autorizado." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Envie o arquivo .zip exportado pelo LinkedIn." };
  }

  try {
    const buffer = await file.arrayBuffer();
    return await parseLinkedInZip(buffer);
  } catch {
    return {
      error:
        "Não foi possível ler o arquivo. Confirme que é o .zip de 'Baixar meus dados' do LinkedIn, ou preencha manualmente.",
    };
  }
}

export type ImportSelection = {
  profile: { apply: boolean; name?: string; headline?: string; bio?: string; location?: string };
  positions: Array<{
    title: string;
    company?: string;
    description?: string;
    location?: string;
    startDate: string | null;
    endDate: string | null;
  }>;
  education: Array<{
    school: string;
    degree?: string;
    fieldOfStudy?: string;
    notes?: string;
    startDate: string | null;
    endDate: string | null;
  }>;
};

export async function importLinkedInData(
  selection: ImportSelection
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (!session?.user) return { error: "Não autorizado." };

  if (selection.profile.apply) {
    const existing = await prisma.profile.findFirst();
    const data = {
      name: selection.profile.name || existing?.name || "Seu Nome",
      headline: selection.profile.headline || existing?.headline || null,
      bio: selection.profile.bio || existing?.bio || null,
      location: selection.profile.location || existing?.location || null,
    };
    if (existing) {
      await prisma.profile.update({ where: { id: existing.id }, data });
    } else {
      await prisma.profile.create({ data });
    }
  }

  const maxOrder = await prisma.timelineItem.aggregate({ _max: { sortOrder: true } });
  let nextOrder = (maxOrder._max.sortOrder ?? 0) + 1;

  for (const position of selection.positions) {
    if (!position.startDate) continue;
    await prisma.timelineItem.create({
      data: {
        type: "EXPERIENCE",
        title: position.title,
        subtitle: position.company || null,
        description: position.description || null,
        location: position.location || null,
        startDate: new Date(position.startDate),
        endDate: position.endDate ? new Date(position.endDate) : null,
        sortOrder: nextOrder++,
      },
    });
  }

  for (const edu of selection.education) {
    if (!edu.startDate) continue;
    const title = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" — ") || "Formação";
    await prisma.timelineItem.create({
      data: {
        type: "EDUCATION",
        title,
        subtitle: edu.school,
        description: edu.notes || null,
        startDate: new Date(edu.startDate),
        endDate: edu.endDate ? new Date(edu.endDate) : null,
        sortOrder: nextOrder++,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/timeline");
  revalidatePath("/admin/profile");
  return { success: true };
}
