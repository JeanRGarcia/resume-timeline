import type { Profile } from "@/generated/prisma/client";

export type TextColorOption = "black" | "white";

export type Appearance = {
  backgroundColor: string | null;
  backgroundImageUrl: string | null;
  cardBackgroundColor: string | null;
  textColor: TextColorOption;
};

export const TEXT_COLOR_VALUES: Record<TextColorOption, string> = {
  black: "#0a0a0a",
  white: "#fafafa",
};

export const DEFAULT_APPEARANCE: Appearance = {
  backgroundColor: null,
  backgroundImageUrl: null,
  cardBackgroundColor: null,
  textColor: "black",
};

export function getAppearance(profile: Profile | null): Appearance {
  if (!profile) return DEFAULT_APPEARANCE;
  return {
    backgroundColor: profile.backgroundColor,
    backgroundImageUrl: profile.backgroundImageUrl,
    cardBackgroundColor: profile.cardBackgroundColor,
    textColor: profile.textColor === "white" ? "white" : "black",
  };
}

/**
 * Resolves the background used for "card-like" surfaces (timeline cards, the
 * profile header backdrop): the user's chosen card color, or a translucent
 * default that contrasts with whichever text color is active — so text stays
 * readable over any background color/image without extra configuration.
 */
export function getCardBackground(appearance: Appearance): string {
  return (
    appearance.cardBackgroundColor ||
    (appearance.textColor === "white" ? "rgba(15, 15, 15, 0.55)" : "rgba(255, 255, 255, 0.85)")
  );
}
