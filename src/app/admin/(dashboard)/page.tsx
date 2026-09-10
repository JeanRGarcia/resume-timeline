import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const [profile, itemCount] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.timelineItem.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Painel</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {profile ? `${profile.name}${profile.headline ? ` · ${profile.headline}` : ""}` : "Perfil ainda não preenchido."}
            </p>
            <Button size="sm" nativeButton={false} render={<Link href="/admin/profile" />}>
              Editar perfil
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "itens"} cadastrados.
            </p>
            <Button size="sm" nativeButton={false} render={<Link href="/admin/timeline" />}>
              Gerenciar timeline
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
