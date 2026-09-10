"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { uploadImage } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ImageUploadField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadImage(formData);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setUrl(result.url);
      toast.success("Imagem enviada.");
    });
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-3">
        {url && (
          <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted">
            <Image src={url} alt={label} fill className="object-cover" sizes="64px" />
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          {isPending ? "Enviando…" : url ? "Trocar imagem" : "Enviar imagem"}
        </Button>
        {url && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setUrl("")}
          >
            Remover
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
