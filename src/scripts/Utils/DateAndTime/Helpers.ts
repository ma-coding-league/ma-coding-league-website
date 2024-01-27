export function isBeforeNow(date: Date) {
  return date.getTime() < Date.now();
}
