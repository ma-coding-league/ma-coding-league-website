import formatNumber from "./fmt";

export { formatNumber };

export function constrain(x: number, min: number, max: number): number {
  return Math.min(Math.max(x, min), max);
}
