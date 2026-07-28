export type Track = {
  title: string;
  artist: string;
  album: string;
  duration: number;
};

export const TRACKS: Track[] = [
  { title: 'Nikes', artist: 'Frank Ocean', album: 'Blonde', duration: 314 },
  { title: 'Ivy', artist: 'Frank Ocean', album: 'Blonde', duration: 249 },
  {
    title: 'Pink + White',
    artist: 'Frank Ocean',
    album: 'Blonde',
    duration: 184,
  },
  { title: 'Solo', artist: 'Frank Ocean', album: 'Blonde', duration: 257 },
  {
    title: 'Self Control',
    artist: 'Frank Ocean',
    album: 'Blonde',
    duration: 249,
  },
  { title: 'Nights', artist: 'Frank Ocean', album: 'Blonde', duration: 307 },
];

export function formatTime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
