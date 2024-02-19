import { getUserTimezoneOffsetInMs } from "@/scripts/Utils/DateAndTime/Helpers";

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

export function formatDateForInput(date: Date) {
  const dateWithOffset = new Date(date.getTime() - getUserTimezoneOffsetInMs());
  const firstHalf = dateWithOffset.toISOString().split(".")[0];
  const pieces = firstHalf.split(":");
  pieces.pop();
  return pieces.join(":");
}
