import JSZip from "jszip";
import Papa from "papaparse";

export type ParsedLinkedInPosition = {
  title: string;
  company?: string;
  description?: string;
  location?: string;
  startDate: string | null; // ISO yyyy-mm-dd
  endDate: string | null;
};

export type ParsedLinkedInEducation = {
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  notes?: string;
  startDate: string | null;
  endDate: string | null;
};

export type ParsedLinkedInProfile = {
  name?: string;
  headline?: string;
  bio?: string;
  location?: string;
};

export type ParsedLinkedInData = {
  profile: ParsedLinkedInProfile;
  positions: ParsedLinkedInPosition[];
  education: ParsedLinkedInEducation[];
  warnings: string[];
};

const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  fev: 1,
  mar: 2,
  apr: 3,
  abr: 3,
  may: 4,
  mai: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  ago: 7,
  sep: 8,
  set: 8,
  oct: 9,
  out: 9,
  nov: 10,
  dec: 11,
  dez: 11,
};

/** Parses LinkedIn's loose date formats ("Jan 2020", "2020", "2020-01") into an ISO date string. */
export function parseLinkedInDate(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;

  const monthYear = value.match(/^([A-Za-zçãéóú]{3,})\.?\s+(\d{4})$/);
  if (monthYear) {
    const monthKey = monthYear[1].slice(0, 3).toLowerCase();
    const month = MONTHS[monthKey];
    if (month !== undefined) {
      return new Date(Date.UTC(Number(monthYear[2]), month, 1))
        .toISOString()
        .slice(0, 10);
    }
  }

  const yearOnly = value.match(/^(\d{4})$/);
  if (yearOnly) {
    return new Date(Date.UTC(Number(yearOnly[1]), 0, 1)).toISOString().slice(0, 10);
  }

  const isoLike = value.match(/^(\d{4})-(\d{1,2})(-(\d{1,2}))?$/);
  if (isoLike) {
    const year = Number(isoLike[1]);
    const month = Number(isoLike[2]) - 1;
    const day = isoLike[4] ? Number(isoLike[4]) : 1;
    return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
  }

  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }

  return null;
}

function parseCsv<T extends Record<string, string>>(csvText: string): T[] {
  const result = Papa.parse<T>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data;
}

function findEntry(
  files: Record<string, JSZip.JSZipObject>,
  name: string
): JSZip.JSZipObject | undefined {
  const target = name.toLowerCase();
  return Object.entries(files).find(
    ([path]) => path.toLowerCase().endsWith(target)
  )?.[1];
}

function pick(row: Record<string, string>, keys: string[]): string | undefined {
  for (const key of keys) {
    const found = Object.keys(row).find(
      (rowKey) => rowKey.trim().toLowerCase() === key.toLowerCase()
    );
    if (found && row[found]?.trim()) return row[found].trim();
  }
  return undefined;
}

export async function parseLinkedInZip(buffer: ArrayBuffer): Promise<ParsedLinkedInData> {
  const warnings: string[] = [];
  const zip = await JSZip.loadAsync(buffer);

  const profile: ParsedLinkedInProfile = {};
  const positions: ParsedLinkedInPosition[] = [];
  const education: ParsedLinkedInEducation[] = [];

  const profileEntry = findEntry(zip.files, "Profile.csv");
  if (profileEntry) {
    const rows = parseCsv<Record<string, string>>(await profileEntry.async("string"));
    const row = rows[0];
    if (row) {
      const first = pick(row, ["First Name"]);
      const last = pick(row, ["Last Name"]);
      profile.name = [first, last].filter(Boolean).join(" ") || undefined;
      profile.headline = pick(row, ["Headline"]);
      profile.bio = pick(row, ["Summary"]);
      profile.location = pick(row, ["Geo Location", "Address"]);
    }
  } else {
    warnings.push("Profile.csv não encontrado no arquivo exportado.");
  }

  const positionsEntry = findEntry(zip.files, "Positions.csv");
  if (positionsEntry) {
    const rows = parseCsv<Record<string, string>>(await positionsEntry.async("string"));
    for (const row of rows) {
      const title = pick(row, ["Title"]);
      if (!title) continue;
      positions.push({
        title,
        company: pick(row, ["Company Name"]),
        description: pick(row, ["Description"]),
        location: pick(row, ["Location"]),
        startDate: parseLinkedInDate(pick(row, ["Started On"])),
        endDate: parseLinkedInDate(pick(row, ["Finished On"])),
      });
    }
  } else {
    warnings.push("Positions.csv não encontrado — experiências não foram importadas.");
  }

  const educationEntry = findEntry(zip.files, "Education.csv");
  if (educationEntry) {
    const rows = parseCsv<Record<string, string>>(await educationEntry.async("string"));
    for (const row of rows) {
      const school = pick(row, ["School Name"]);
      if (!school) continue;
      education.push({
        school,
        degree: pick(row, ["Degree Name"]),
        fieldOfStudy: pick(row, ["Field Of Study"]),
        notes: pick(row, ["Notes"]),
        startDate: parseLinkedInDate(pick(row, ["Start Date"])),
        endDate: parseLinkedInDate(pick(row, ["End Date"])),
      });
    }
  } else {
    warnings.push("Education.csv não encontrado — formação não foi importada.");
  }

  if (positions.length === 0 && education.length === 0) {
    warnings.push(
      "Nenhum item pôde ser lido automaticamente. Preencha manualmente pela timeline."
    );
  }

  return { profile, positions, education, warnings };
}
