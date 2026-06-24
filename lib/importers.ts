import type { AlumniProfile } from "@/lib/types";

type ImportedRow = Record<string, string | number | boolean | null | undefined>;

const normalize = (value: unknown) => String(value ?? "").trim();

export function rowToAlumni(row: ImportedRow, index: number): AlumniProfile {
  const name = normalize(row.name) || normalize(row.fullName) || "Imported Alumni";
  const cohort = normalize(row.cohort) || normalize(row.year) || normalize(row.graduationYear);

  return {
    id: `imported-${Date.now()}-${index}`,
    name,
    cohort,
    school: normalize(row.school),
    industry: normalize(row.industry) || normalize(row.interest),
    email: normalize(row.email),
    phone: normalize(row.phone),
    city: normalize(row.city) || normalize(row.location),
    business: normalize(row.business) || normalize(row.idea),
    status: normalize(row.status) || "Imported",
    skills: normalize(row.skills) || normalize(row.notes),
    openToMentor: normalize(row.openToMentor).toLowerCase() === "true"
  };
}

export async function parseRosterFile(file: File): Promise<AlumniProfile[]> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    return parseCsv(await file.text()).map(rowToAlumni);
  }

  if (extension === "xlsx" || extension === "xls") {
    throw new Error("Excel files are accepted by the UI, but Phase 1 needs the generated backend parser before saving them.");
  }

  throw new Error("Please upload a CSV, XLS, or XLSX roster file.");
}

function parseCsv(text: string): ImportedRow[] {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map(parseCsvLine);

  const headers = rows.shift()?.map((header) => header.trim()) ?? [];
  if (headers.length === 0) return [];

  return rows.map((row) =>
    headers.reduce<ImportedRow>((record, header, index) => {
      record[header] = row[index] ?? "";
      return record;
    }, {})
  );
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
}
