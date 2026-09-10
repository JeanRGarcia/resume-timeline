import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!email || !password) {
    throw new Error(
      "Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env antes de rodar o seed."
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });
  console.log(`Admin pronto: ${admin.email}`);

  const profile = await prisma.profile.findFirst();
  if (!profile) {
    await prisma.profile.create({
      data: {
        name,
        headline: "Seu cargo ou título profissional",
        bio: "Escreva aqui uma breve descrição sobre você. Edite este texto no painel /admin.",
      },
    });
    console.log("Perfil inicial criado.");
  }

  const itemCount = await prisma.timelineItem.count();
  if (itemCount === 0) {
    await prisma.timelineItem.createMany({
      data: [
        {
          type: "EDUCATION",
          title: "Graduação em Exemplo",
          subtitle: "Nome da Instituição",
          description: "Descreva aqui o que você estudou e conquistou.",
          startDate: new Date("2018-02-01"),
          endDate: new Date("2021-12-01"),
          sortOrder: 0,
        },
        {
          type: "EXPERIENCE",
          title: "Cargo de Exemplo",
          subtitle: "Nome da Empresa",
          description: "Descreva suas responsabilidades e conquistas nesse cargo.",
          startDate: new Date("2022-01-01"),
          endDate: null,
          sortOrder: 1,
        },
      ],
    });
    console.log("Itens de exemplo criados na timeline.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
