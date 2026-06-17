export const getYouTubeId = (url) => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const formatDuration = (duration) => {
  if (!duration) return '—';
  if (typeof duration === 'string' && duration.includes(':')) return duration;
  if (typeof duration === 'number' && duration < 120) return `${duration} min`;
  if (typeof duration === 'number' && duration >= 120) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return duration;
};

export const parseDurationToSeconds = (duration) => {
  if (!duration) return 0;
  if (typeof duration === 'number') return duration;
  if (typeof duration === 'string') {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1) return parts[0];
  }
  if (typeof duration === 'object' && duration.totalSeconds) return duration.totalSeconds;
  return 0;
};