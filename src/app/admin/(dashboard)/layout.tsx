import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-8">
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/admin">Painel</Link>
            <Link href="/admin/profile" className="text-muted-foreground hover:text-foreground">
              Perfil
            </Link>
            <Link href="/admin/timeline" className="text-muted-foreground hover:text-foreground">
              Timeline
            </Link>
            <Link href="/admin/import" className="text-muted-foreground hover:text-foreground">
              Importar LinkedIn
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-muted-foreground hover:text-foreground">
              Ver site
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
