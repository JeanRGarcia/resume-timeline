import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProfileHeader } from "@/components/profile-header";
import { Timeline } from "@/components/timeline/timeline";
import { RootCanvasStyle } from "@/components/root-canvas-style";
import { getAppearance, TEXT_COLOR_VALUES } from "@/lib/appearance";

export const dynamic = "force-dynamic";

// Shared by generateMetadata and the page so the profile is read once per request.
const getProfile = cache(() => prisma.profile.findFirst());

// Link-preview title and description (LinkedIn, WhatsApp, etc.) come from the profile.
// The preview image is src/app/opengraph-image.jpg.
export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  if (!profile) return {};

  const title = `${profile.name} | Currículo`;
  const description =
    profile.headline ?? "Currículo em formato de linha do tempo horizontal.";

  return {
    title,
    description,
    openGraph: { title, description, type: "website", locale: "pt_BR" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Home() {
  const [profile, items] = await Promise.all([
    getProfile(),
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
      <RootCanvasStyle appearance={appearance} />
      <div className="mx-auto w-full max-w-5xl px-4 pt-12 sm:px-8">
        <ProfileHeader profile={profile} appearance={appearance} />
      </div>
      <div className="mt-10">
        <Timeline items={items} appearance={appearance} />
      </div>
    </div>
  );
}
