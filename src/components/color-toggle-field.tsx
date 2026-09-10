"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";

export function ColorToggleField({
  label,
  enabledName,
  colorName,
  defaultColor,
}: {
  label: string;
  enabledName: string;
  colorName: string;
  defaultColor: string | null | undefined;
}) {
  const [enabled, setEnabled] = useState(Boolean(defaultColor));
  const [color, setColor] = useState(defaultColor || "#1f2937");

  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-2 font-normal">
        <input
          type="checkbox"
          name={enabledName}
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          name={colorName}
          value={color}
          disabled={!enabled}
          onChange={(e) => setColor(e.target.value)}
          className="h-9 w-16 rounded border border-input disabled:opacity-40"
        />
        <span className="text-xs text-muted-foreground">
          {enabled ? color : "Usando o padrão do tema"}
        </span>
      </div>
    </div>
  );
}
