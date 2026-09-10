import { prisma } from "@/lib/prisma";
import { ProfileHeader } from "@/components/profile-header";
import { Timeline } from "@/components/timeline/timeline";
import { getAppearance, TEXT_COLOR_VALUES } from "@/lib/appearance";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, items] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.timelineItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
    }),
  ]);

  const appearance = getAppearance(profile);

  return (
    <div
      className="min-h-screen flex-1"
      style={{ color: TEXT_COLOR_VALUES[appearance.textColor] }}
    >
      <div className="mx-auto w-full max-w-5xl px-4 pt-12 sm:px-8">
        <ProfileHeader profile={profile} textColor={appearance.textColor} />
      </div>
      <div className="mt-10">
        <Timeline items={items} appearance={appearance} />
      </div>
    </div>
  );
}
