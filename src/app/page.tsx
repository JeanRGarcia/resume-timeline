import { prisma } from "@/lib/prisma";
import { ProfileHeader } from "@/components/profile-header";
import { Timeline } from "@/components/timeline/timeline";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, items] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.timelineItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
    }),
  ]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-8">
      <ProfileHeader profile={profile} />
      <Timeline items={items} />
    </main>
  );
}
