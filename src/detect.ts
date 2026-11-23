import { type Script, scriptOf } from "@/script";

export type { Script } from "@/script";

export function detect(text: string): Script;
export function detect(lines: readonly string[]): Script[];
export function detect(text: string | readonly string[]) {
  return typeof text === "string" ? scriptOf(text) : text.map(scriptOf);
}
