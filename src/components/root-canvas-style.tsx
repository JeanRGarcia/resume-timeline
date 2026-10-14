import type { Appearance } from "@/lib/appearance";

const HEX_COLOR = /^#[0-9a-f]{3,8}$/i;

/**
 * Makes the document itself (the area behind and beside the page, including the
 * gutter of the page's own scrollbar) match the owner's chosen look. The scene
 * background is a fixed layer inside the page, which never reaches that gutter,
 * so without this a light strip shows next to the scrollbar on a dark page.
 * Rendered only on the public page, so the admin keeps the default theme.
 */
export function RootCanvasStyle({ appearance }: { appearance: Appearance }) {
  const dark = appearance.textColor === "white";
  const background =
    appearance.backgroundColor && HEX_COLOR.test(appearance.backgroundColor)
      ? appearance.backgroundColor
      : dark
        ? "#0a0a0a"
        : "#ffffff";
  const thumb = dark ? "rgb(255 255 255 / 0.4)" : "rgb(0 0 0 / 0.35)";

  // body is made transparent so its own background doesn't paint over the fixed
  // scene layer once <html> has a background of its own.
  return (
    <style>{`html{background-color:${background};color-scheme:${dark ? "dark" : "light"};scrollbar-width:thin;scrollbar-color:${thumb} transparent}body{background:transparent}`}</style>
  );
}
