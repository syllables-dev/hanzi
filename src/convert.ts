import { type Dictionary, dictionaries, type Target } from "@/dictionary";
import { onlyIn, scriptOf } from "@/script";

function chooseFromWords(
  { longest, words }: Dictionary,
  chars: string[],
  position: number
) {
  for (let length = Math.min(longest, chars.length); length > 0; length -= 1) {
    const last = Math.min(position, chars.length - length);
    for (
      let start = Math.max(0, position - length + 1);
      start <= last;
      start += 1
    ) {
      const output = words.get(chars.slice(start, start + length).join(""));
      if (output !== undefined) {
        return [...output][position - start];
      }
    }
  }
}

function convertLine(line: string, target: Target) {
  const dictionary = dictionaries[target];
  const foreign = target === "hant" ? onlyIn.hans : onlyIn.hant;
  const settled = scriptOf(line) === target;
  const chars = [...line];
  return chars
    .map((char, position) => {
      if (settled && !foreign.has(char)) {
        return char;
      }
      return (
        dictionary.chars.get(char) ??
        (dictionary.words.has(char)
          ? chooseFromWords(dictionary, chars, position)
          : undefined) ??
        char
      );
    })
    .join("");
}

export function converter(target: Target) {
  return (text: string) =>
    text
      .split("\n")
      .map((line) => convertLine(line, target))
      .join("\n");
}
