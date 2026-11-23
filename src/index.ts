// biome-ignore-all lint/performance/noBarrelFile: file defines package public surface

import { toHans } from "@/hans";
import { toHant } from "@/hant";
import type { Target } from "@/script";

export { detect, type Script } from "@/detect";
export { toHans } from "@/hans";
export { toHant } from "@/hant";
export type { Target } from "@/script";

export function convert(text: string, target: Target): string;
export function convert(lines: readonly string[], target: Target): string[];
export function convert(text: string | readonly string[], target: Target) {
  const convertTo = target === "hant" ? toHant : toHans;
  return typeof text === "string" ? convertTo(text) : convertTo(text);
}
