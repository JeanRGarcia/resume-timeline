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
  textColor: z.enum(["black", "white"]).default("black"),
  backgroundColorEnabled: z.string().optional(),
  backgroundColor: z.string().optional(),
  backgroundImageUrl: z.string().optional(),
  cardBackgroundColorEnabled: z.string().optional(),
  cardBackgroundColor: z.string().optional(),
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

  const {
    backgroundColorEnabled,
    cardBackgroundColorEnabled,
    backgroundColor,
    cardBackgroundColor,
    backgroundImageUrl,
    textColor,
    ...rest
  } = parsed.data;

  const data = {
    ...Object.fromEntries(
      Object.entries(rest).map(([key, value]) => [key, value || null])
    ),
    name: parsed.data.name,
    textColor,
    backgroundColor: backgroundColorEnabled ? backgroundColor || null : null,
    cardBackgroundColor: cardBackgroundColorEnabled ? cardBackgroundColor || null : null,
    backgroundImageUrl: backgroundImageUrl || null,
  };

  const existing = await prisma.profile.findFirst();
  if (existing) {
    await prisma.profile.update({ where: { id: existing.id }, data });
  } else {
    await prisma.profile.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/profile");
  return undefined;
}
