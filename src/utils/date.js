export const formatRelative = (dateAsString) => {
  const newDate = new Date(dateAsString);
  const now = Date.now();
  const diff = (newDate - now) / 1000; // en segundos
  const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const absoluteDiffInSeconds = Math.abs(diff);
  if (absoluteDiffInSeconds < 60) return relativeTime.format(Math.round(diff), 'second');
  if (absoluteDiffInSeconds < 3600) return relativeTime.format(Math.round(diff / 60), 'minute');
  if (absoluteDiffInSeconds < 86400) return relativeTime.format(Math.round(diff / 3600), 'hour');
  if (absoluteDiffInSeconds < 2592000) return relativeTime.format(Math.round(diff / 86400), 'day');
  if (absoluteDiffInSeconds < 31536000) return relativeTime.format(Math.round(diff / 2592000), 'month');
  return relativeTime.format(Math.round(diff / 31536000), 'year');
}
