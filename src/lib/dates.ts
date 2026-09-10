const monthYearFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Dates on the timeline only carry month/year precision. We anchor every date at
 * UTC midnight (both when parsing a "YYYY-MM-DD" input and when formatting for
 * display) so the calendar day never shifts due to the server's local timezone.
 */
export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatMonthYear(date: Date): string {
  const formatted = monthYearFormatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).replace(".", "");
}

export function formatDateRange(startDate: Date, endDate: Date | null): string {
  const start = formatMonthYear(startDate);
  const end = endDate ? formatMonthYear(endDate) : "Presente";
  return `${start} — ${end}`;
}
