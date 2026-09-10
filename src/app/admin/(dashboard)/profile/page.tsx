import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/admin/profile-form";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Perfil</h1>
      <ProfileForm key={profile?.updatedAt.toISOString() ?? "new"} profile={profile} />
    </div>
  );
}
