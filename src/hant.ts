import { converter } from "@/convert";

const convertText = converter("hant");

export function toHant(text: string): string;
export function toHant(lines: readonly string[]): string[];
export function toHant(text: string | readonly string[]) {
  return typeof text === "string" ? convertText(text) : text.map(convertText);
}
