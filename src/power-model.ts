export interface ScheduledPowerOff {
  active?: boolean;
  deadline?: number | null;
  warning_sent?: boolean;
  last_result?: string | null;
  error?: string | null;
}

export interface IdleStandby {
  enabled?: boolean;
  effective_hours?: number | null;
  original_value?: string | null;
  pending?: boolean;
  error?: string | null;
}

const madridParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

export function madridInput(epochMilliseconds: number): string {
  const parts = Object.fromEntries(madridParts.formatToParts(epochMilliseconds).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

export function exactMadridTime(epochSeconds: number): string {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid", weekday: "short", day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).format(epochSeconds * 1000);
}

export function durationSeconds(hours: string, minutes: string, seconds: string): number | null {
  const values = [hours, minutes, seconds];
  if (values.some(value => !/^\d+$/.test(value))) return null;
  const [h, m, s] = values.map(Number);
  if (!Number.isSafeInteger(h) || !Number.isSafeInteger(m) || !Number.isSafeInteger(s) || m > 59 || s > 59) return null;
  const total = h * 3600 + m * 60 + s;
  return Number.isSafeInteger(total) && total >= 1 && total <= 30 * 86400 ? total : null;
}

export function countdown(deadline: number, now: number): string {
  const seconds = Math.max(0, Math.ceil(deadline - now));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  return `${hours} h ${String(minutes).padStart(2, "0")} min ${String(seconds % 60).padStart(2, "0")} s`;
}
