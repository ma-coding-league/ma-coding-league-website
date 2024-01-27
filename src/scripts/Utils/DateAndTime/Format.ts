export function formatDateLong(date: Date) {
  const locale = new Intl.NumberFormat().resolvedOptions().locale;
  return date.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: Date) {
  const locale = new Intl.NumberFormat().resolvedOptions().locale;
  return date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "numeric",
  });
}
