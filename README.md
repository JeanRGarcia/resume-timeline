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
3. No dashboard do projeto na Vercel, aba **Storage**:
   - Crie um banco **Postgres** e conecte ao projeto (isso preenche `DATABASE_URL` automaticamente).
   - Crie um **Blob Store** e conecte ao projeto (isso preenche `BLOB_READ_WRITE_TOKEN` automaticamente).
4. Em **Settings > Environment Variables**, adicione:
   - `AUTH_SECRET` (gere com `npx auth secret`)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` (usados só na primeira vez, pelo seed)
5. Faça o deploy.
6. Rode o seed contra o banco de produção para criar sua conta admin. A forma mais simples é
   rodar localmente com a `DATABASE_URL` de produção no `.env`:

   ```bash
   npm run db:seed
   ```

7. Acesse `https://seu-dominio.vercel.app/admin/login` e comece a preencher seu perfil e sua timeline.

## Importando dados do LinkedIn

No LinkedIn, vá em **Configurações e privacidade → Privacidade de dados → Obter uma
cópia dos seus dados**, solicite o arquivo (chega por email em alguns minutos) e envie
o `.zip` recebido em `/admin/import`. O importador lê `Profile.csv`, `Positions.csv` e
`Education.csv` de dentro do zip. Caso o formato do arquivo mude ou algum item não seja
reconhecido, você pode sempre preencher/editar manualmente pela timeline.

## Estrutura do projeto

```
prisma/schema.prisma       Modelo de dados (Profile, TimelineItem, AdminUser)
prisma/seed.ts             Cria a conta admin e dados de exemplo
src/app/                   Rotas (site público + painel /admin)
src/actions/                Server Actions (perfil, timeline, upload, import LinkedIn)
src/components/timeline/    Componentes da timeline horizontal/vertical
src/lib/                    Auth, Prisma client, parsing de datas e do LinkedIn
```
