# Currículo Timeline

Um currículo em formato de linha do tempo horizontal. Cada pessoa que usar este
template faz o próprio deploy (Vercel + banco de dados próprio) e edita o
conteúdo por um painel administrativo — sem precisar mexer em código.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Prisma](https://www.prisma.io) + PostgreSQL (ex: [Vercel Postgres](https://vercel.com/storage/postgres))
- [Auth.js](https://authjs.dev) (login único do administrador)
- [Vercel Blob](https://vercel.com/storage/blob) (upload de imagens)
- Tailwind CSS + shadcn/ui + Framer Motion

## Funcionalidades

- Timeline pública horizontal (com fallback vertical no mobile)
- Painel `/admin` protegido por login para editar perfil e itens da timeline
- Upload de foto de perfil e imagens dos itens
- Importação de experiências e formação a partir do arquivo de dados exportado do LinkedIn (com fallback manual)
- Aparência customizável: cor do texto (preto/branco), cor de fundo, cor dos cards e uma imagem de fundo que rola junto com a timeline horizontal (efeito sidescroller)

## Rodando localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha as variáveis (veja detalhes abaixo).

3. Suba um banco Postgres local (o Prisma provisiona um automaticamente, sem precisar de Docker):

   ```bash
   npx prisma dev
   ```

   Copie a `DATABASE_URL` impressa no terminal para o seu `.env`.

4. Rode as migrations e o seed (cria a conta admin e alguns itens de exemplo):

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

6. Acesse `http://localhost:3000` (site público) e `http://localhost:3000/admin/login`
   (painel administrativo, com o email/senha definidos em `ADMIN_EMAIL`/`ADMIN_PASSWORD`).

## Fazendo o deploy do seu próprio currículo

1. Faça um fork/clone deste repositório para o seu GitHub.
2. Crie um novo projeto na [Vercel](https://vercel.com/new) apontando para o seu repositório.
   - A Vercel costuma pré-preencher uma `DATABASE_URL` de exemplo lendo o `.env.example` do
     repo. Ignore por enquanto — ela vai ser resolvida no próximo passo.
3. No dashboard do projeto na Vercel, aba **Storage**:
   - **Create Database → Postgres** (recomendado: **Neon**, não "Prisma Postgres" — este projeto
     usa o driver `pg` puro, que não é compatível com o Accelerate/Data Proxy do Prisma Postgres).
     No modal de conexão, defina o **Custom Environment Variable Prefix** como `DATABASE`
     (não deixe o padrão sugerido, tipo `STORAGE`) — isso garante que a variável final se
     chame exatamente `DATABASE_URL`, que é o nome que o projeto espera.
   - Se aparecer erro de "nome duplicado" ao conectar, é a `DATABASE_URL` de exemplo do passo 2
     brigando pelo nome — vá em **Settings → Environment Variables**, delete a variável de
     exemplo e tente conectar o banco de novo.
   - **Create Database → Blob**, conecte ao projeto (preenche `BLOB_READ_WRITE_TOKEN`
     automaticamente). Sem isso, upload de imagens não funciona em produção.
4. Em **Settings → Environment Variables**, adicione manualmente:
   - `AUTH_SECRET` (gere com `npx auth secret` ou `openssl rand -base64 32`)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` (usados só uma vez, pelo seed, pra criar
     sua conta de admin — depois disso podem ficar desatualizados sem problema)
   - Marque **Production**, **Preview** e **Development** em cada uma.
5. Faça o deploy. As migrations do Prisma rodam automaticamente durante o build
   (`prisma migrate deploy && next build`), então o banco já fica com as tabelas certas.
6. Crie sua conta de admin no banco de produção (o deploy só cria as tabelas, não os dados).
   Localmente, na pasta do projeto:

   ```bash
   npx vercel login
   npx vercel link                                   # linke ao projeto que você criou
   cp .env .env.dev.backup
   npx vercel env pull .env --environment=production
   npm run db:seed
   mv .env.dev.backup .env
   ```

   Se você marcou `ADMIN_EMAIL`/`ADMIN_PASSWORD`/`ADMIN_NAME` como **Sensitive** na Vercel,
   o `vercel env pull` não consegue ler o valor de volta (é assim que a Vercel protege
   variáveis sensíveis — somente escrita). Nesse caso, passe os valores direto na hora de
   rodar o seed, sem depender do `.env` baixado:

   ```bash
   ADMIN_EMAIL="seu@email.com" ADMIN_PASSWORD="sua-senha" ADMIN_NAME="Seu Nome" npx tsx prisma/seed.ts
   ```

7. Acesse `https://seu-projeto.vercel.app/admin/login` e comece a preencher seu perfil e sua timeline.

## Importando dados do LinkedIn

No LinkedIn (pelo navegador), vá em **Configurações e Privacidade → Privacidade dos dados
→ Baixe seus dados**. Escolha a opção **"Deseja algo em particular?"** e marque a caixa
**Perfil** (esse pacote já inclui cargos e formação dentro do zip, mesmo sem aparecerem
como caixas separadas nessa tela). Clique em **Solicitar arquivo** — o LinkedIn avisa por
email quando o `.zip` estiver pronto (pode levar de minutos a algumas horas).

Depois é só enviar esse `.zip` em `/admin/import`. O importador lê `Profile.csv`,
`Positions.csv` e `Education.csv` de dentro dele. Caso o formato do arquivo mude ou algum
item não seja reconhecido, você pode sempre preencher/editar manualmente pela timeline.

## Estrutura do projeto

```
prisma/schema.prisma       Modelo de dados (Profile, TimelineItem, AdminUser)
prisma/seed.ts             Cria a conta admin e dados de exemplo
src/app/                   Rotas (site público + painel /admin)
src/actions/                Server Actions (perfil, timeline, upload, import LinkedIn)
src/components/timeline/    Componentes da timeline horizontal/vertical
src/lib/                    Auth, Prisma client, parsing de datas e do LinkedIn
```
