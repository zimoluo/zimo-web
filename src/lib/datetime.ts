const ISO_UTC =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

export function isIsoInstant(value: string): boolean {
  const parts = ISO_UTC.exec(value);
  if (parts === null) return false;

  const [year, month, day, hour, minute, second] = parts
    .slice(1)
    .map((part) => (part === undefined ? 0 : Number(part)));

  if (hour === undefined || minute === undefined) return false;
  if (hour > 23 || minute > 59 || (second ?? 0) > 59) return false;

  const asUtc = new Date(Date.UTC(year as number, (month as number) - 1, day));
  return (
    asUtc.getUTCFullYear() === year &&
    asUtc.getUTCMonth() + 1 === month &&
    asUtc.getUTCDate() === day &&
    !Number.isNaN(Date.parse(value))
  );
}

export function parseInstant(value: string): Date | null {
  if (!isIsoInstant(value)) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toInstant(value: string): string | null {
  const parsed = parseInstant(value);
  return parsed === null ? null : parsed.toISOString();
}

export const compareDesc = (a: string, b: string): number =>
  a === b ? 0 : a < b ? 1 : -1;

export const compareAsc = (a: string, b: string): number => -compareDesc(a, b);

const ABSOLUTE: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
};

export function formatAbsolute(
  iso: string,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
): string {
  const parsed = parseInstant(iso);
  if (parsed === null) return "";
  return new Intl.DateTimeFormat(locale, { ...ABSOLUTE, ...options }).format(
    parsed,
  );
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const ABSOLUTE_AFTER = 15 * DAY;

type Unit = readonly [Intl.RelativeTimeFormatUnit, number];

const UNITS: readonly Unit[] = [
  ["day", DAY],
  ["hour", HOUR],
  ["minute", MINUTE],
];

export function formatRelative(
  iso: string,
  now: Date = new Date(),
  locale?: string,
): string {
  const parsed = parseInstant(iso);
  if (parsed === null) return "";

  const elapsed = now.getTime() - parsed.getTime();

  if (elapsed >= ABSOLUTE_AFTER) return formatAbsolute(iso, undefined, locale);

  const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const [unit, span] of UNITS) {
    if (Math.abs(elapsed) >= span) {
      return relative.format(-Math.trunc(elapsed / span), unit);
    }
  }

  return relative.format(0, "second");
}

export function readingTime(minutes: number, locale?: string): string {
  const total = Math.max(1, Math.ceil(minutes));
  const format = new Intl.NumberFormat(locale);

  if (total >= 1440) return "You don't wanna read this";

  if (total >= 60) {
    const hours = Math.floor(total / 60);
    const rest = total % 60;
    const hoursPart = `${format.format(hours)} hr${hours === 1 ? "" : "s"}`;
    return rest === 0
      ? `${hoursPart} read`
      : `${hoursPart} ${format.format(rest)} min read`;
  }

  return `${format.format(total)} min read`;
}
