"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  headline: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
});

export type ProfileFormState = { error?: string } | undefined;

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user) return { error: "Não autorizado." };

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const data = Object.fromEntries(
    Object.entries(parsed.data).map(([key, value]) => [key, value || null])
  ) as Record<string, string | null>;

  const existing = await prisma.profile.findFirst();
  if (existing) {
    await prisma.profile.update({ where: { id: existing.id }, data: { ...data, name: parsed.data.name } });
  } else {
    await prisma.profile.create({ data: { ...data, name: parsed.data.name } });
  }

  revalidatePath("/");
  revalidatePath("/admin/profile");
  return undefined;
}
