import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Link2, Globe } from "lucide-react";
import type { TextColorOption } from "@/lib/appearance";
import type { Profile } from "@/generated/prisma/client";

export function ProfileHeader({
  profile,
  textColor = "black",
}: {
  profile: Profile | null;
  textColor?: TextColorOption;
}) {
  if (!profile) {
    return (
      <p className="text-sm opacity-70">
        Perfil não configurado ainda. Acesse /admin para preencher seus dados.
      </p>
    );
  }

  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const links = [
    { href: profile.email && `mailto:${profile.email}`, icon: Mail, label: profile.email },
    { href: profile.phone && `tel:${profile.phone}`, icon: Phone, label: profile.phone },
    { href: profile.linkedinUrl, icon: Link2, label: "LinkedIn" },
    { href: profile.githubUrl, icon: Link2, label: "GitHub" },
    { href: profile.websiteUrl, icon: Globe, label: "Site" },
  ].filter((link): link is { href: string; icon: typeof Mail; label: string } =>
    Boolean(link.href)
  );

  const borderClass = textColor === "white" ? "border-white/20" : "border-black/10";

  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
      <Avatar className={`h-24 w-24 border ${borderClass}`}>
        <AvatarImage src={profile.avatarUrl ?? undefined} alt={profile.name} />
        <AvatarFallback className="text-xl">{initials}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {profile.name}
          </h1>
          {profile.headline && <p className="text-lg opacity-80">{profile.headline}</p>}
          {profile.location && (
            <p className="flex items-center justify-center gap-1 text-sm opacity-70 sm:justify-start">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </p>
          )}
        </div>
        {profile.bio && <p className="max-w-2xl text-sm opacity-80">{profile.bio}</p>}
        {links.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 sm:justify-start">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm opacity-70 hover:opacity-100"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
