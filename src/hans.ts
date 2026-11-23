import { converter } from "@/convert";

const convertText = converter("hans");

export function toHans(text: string): string;
export function toHans(lines: readonly string[]): string[];
export function toHans(text: string | readonly string[]) {
  return typeof text === "string" ? convertText(text) : text.map(convertText);
}
