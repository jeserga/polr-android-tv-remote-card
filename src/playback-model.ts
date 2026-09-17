export interface Playback {
  source?: string;
  item_id?: string;
  title?: string;
  state?: string;
  position?: number;
  duration?: number;
  observed_at?: number;
  seekable?: boolean;
}

export function playbackTime(value: number): string {
  const seconds = Math.max(0, Math.floor(value || 0));
  return `${Math.floor(seconds / 3600).toString().padStart(2, "0")}:${Math.floor(seconds / 60 % 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}

export function parsePlaybackTime(value: string): number | null {
  const match = /^(\d{1,3}):([0-5]\d):([0-5]\d)$/.exec(value.trim());
  return match ? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) : null;
}

export function playbackPosition(playback: Playback, now: number): { position: number; fresh: boolean; canSeek: boolean } {
  const age = playback.observed_at ? now - playback.observed_at : Infinity;
  const fresh = age >= -2 && age <= 15;
  const duration = Math.max(0, playback.duration || 0);
  const position = Math.max(0, Math.min(duration, (playback.position || 0) + (fresh && playback.state === "playing" ? Math.max(0, age) : 0)));
  return { position, fresh, canSeek: fresh && playback.seekable === true && duration > 0 && !!playback.item_id };
}
