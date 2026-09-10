"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/actions/profile";
import { ImageUploadField } from "@/components/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/generated/prisma/client";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, isPending] = useActionState(updateProfile, undefined);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          <ImageUploadField
            name="avatarUrl"
            label="Foto de perfil"
            defaultValue={profile?.avatarUrl}
          />

          <div className="space-y-1.5">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" name="name" defaultValue={profile?.name} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="headline">Título profissional</Label>
            <Input
              id="headline"
              name="headline"
              placeholder="Ex: Desenvolvedor Full-Stack"
              defaultValue={profile?.headline ?? ""}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={4} defaultValue={profile?.bio ?? ""} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={profile?.email ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" defaultValue={profile?.phone ?? ""} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Localização</Label>
            <Input id="location" name="location" defaultValue={profile?.location ?? ""} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input id="linkedinUrl" name="linkedinUrl" defaultValue={profile?.linkedinUrl ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="githubUrl">GitHub</Label>
              <Input id="githubUrl" name="githubUrl" defaultValue={profile?.githubUrl ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="websiteUrl">Site</Label>
              <Input id="websiteUrl" name="websiteUrl" defaultValue={profile?.websiteUrl ?? ""} />
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando…" : "Salvar perfil"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
