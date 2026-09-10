import Link from "next/link";
import { LinkedInImportFlow } from "@/components/admin/linkedin-import-flow";

export default function LinkedInImportPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Importar do LinkedIn</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          No LinkedIn, vá em <strong>Configurações e privacidade → Privacidade de dados → Obter uma cópia dos seus dados</strong>,
          solicite o arquivo e envie o .zip recebido por email aqui. Se a leitura falhar, você
          pode preencher os itens manualmente pela <Link href="/admin/timeline/new" className="underline">timeline</Link>.
        </p>
      </div>
      <LinkedInImportFlow />
    </div>
  );
}
