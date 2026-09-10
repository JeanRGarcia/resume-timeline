"use server";

import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadImage(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const session = await auth();
  if (!session?.user) return { error: "Não autorizado." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Nenhum arquivo enviado." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Formato de imagem não suportado." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "Imagem maior que 5MB." };
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      error:
        "Upload de imagens não configurado. Defina BLOB_READ_WRITE_TOKEN (Vercel Blob) no .env.",
    };
  }

  const blob = await put(`timeline/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return { url: blob.url };
}
