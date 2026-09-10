"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { parseLinkedInExport, importLinkedInData } from "@/actions/linkedin-import";
import type { ParsedLinkedInData } from "@/lib/linkedin-import";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LinkedInImportFlow() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<ParsedLinkedInData | null>(null);

  const [applyProfile, setApplyProfile] = useState(true);
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [selectedPositions, setSelectedPositions] = useState<boolean[]>([]);
  const [selectedEducation, setSelectedEducation] = useState<boolean[]>([]);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await parseLinkedInExport(formData);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setData(result);
      setName(result.profile.name ?? "");
      setHeadline(result.profile.headline ?? "");
      setBio(result.profile.bio ?? "");
      setLocation(result.profile.location ?? "");
      setSelectedPositions(result.positions.map((p) => Boolean(p.startDate)));
      setSelectedEducation(result.education.map((e) => Boolean(e.startDate)));
      result.warnings.forEach((warning) => toast.warning(warning));
    });
  }

  function handleImport() {
    if (!data) return;

    startTransition(async () => {
      const result = await importLinkedInData({
        profile: { apply: applyProfile, name, headline, bio, location },
        positions: data.positions.filter((_, i) => selectedPositions[i]),
        education: data.education.filter((_, i) => selectedEducation[i]),
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Importação concluída.");
      router.push("/admin/timeline");
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Label htmlFor="linkedin-zip">Arquivo .zip do LinkedIn</Label>
          <Input
            id="linkedin-zip"
            type="file"
            accept=".zip"
            className="mt-1.5"
            disabled={isPending}
            onChange={handleFile}
          />
        </CardContent>
      </Card>

      {data && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    checked={applyProfile}
                    onChange={(e) => setApplyProfile(e.target.checked)}
                  />
                  Atualizar perfil
                </label>
              </CardTitle>
            </CardHeader>
            {applyProfile && (
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Nome</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Título profissional</Label>
                  <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Localização</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Bio</Label>
                  <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
              </CardContent>
            )}
          </Card>

          {data.positions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Experiências ({data.positions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.positions.map((position, index) => (
                  <label key={index} className="flex items-start gap-2 rounded-md border p-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selectedPositions[index] ?? false}
                      disabled={!position.startDate}
                      onChange={(e) =>
                        setSelectedPositions((prev) => {
                          const next = [...prev];
                          next[index] = e.target.checked;
                          return next;
                        })
                      }
                    />
                    <span>
                      <span className="font-medium">{position.title}</span>
                      {position.company && ` · ${position.company}`}
                      {!position.startDate && (
                        <span className="block text-xs text-destructive">
                          Sem data reconhecida — não será importado.
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </CardContent>
            </Card>
          )}

          {data.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Formação ({data.education.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.education.map((edu, index) => (
                  <label key={index} className="flex items-start gap-2 rounded-md border p-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selectedEducation[index] ?? false}
                      disabled={!edu.startDate}
                      onChange={(e) =>
                        setSelectedEducation((prev) => {
                          const next = [...prev];
                          next[index] = e.target.checked;
                          return next;
                        })
                      }
                    />
                    <span>
                      <span className="font-medium">{edu.school}</span>
                      {edu.degree && ` · ${edu.degree}`}
                      {!edu.startDate && (
                        <span className="block text-xs text-destructive">
                          Sem data reconhecida — não será importado.
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </CardContent>
            </Card>
          )}

          <Button onClick={handleImport} disabled={isPending}>
            {isPending ? "Importando…" : "Confirmar importação"}
          </Button>
        </>
      )}
    </div>
  );
}
