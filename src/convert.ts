import {
  cantonese,
  type Dictionary,
  dictionaries,
  type Target,
} from "@/dictionary";
import { onlyIn, scriptOf } from "@/script";

function chooseFromWords(
  { longest, words }: Dictionary,
  chars: string[],
  position: number,
  shortest: number
) {
  for (
    let length = Math.min(longest, chars.length);
    length >= shortest;
    length -= 1
  ) {
    const first = Math.max(0, position - length + 1);
    for (
      let start = Math.min(position, chars.length - length);
      start >= first;
      start -= 1
    ) {
      const output = words.get(chars.slice(start, start + length).join(""));
      if (output !== undefined) {
        return [...output][position - start];
      }
    }
  }
}

const cantoneseMarks =
  /[嘅咗啲喺嗰冇唔佢哋嚟咩嘢乜噉啱㗎喎嚿瞓攞揾搵谂諗畀睇冧嬲]/u;

function chooseInCantonese(chars: string[], position: number) {
  const own = chooseFromWords(cantonese, chars, position, 2);
  if (own !== undefined) {
    return own;
  }
  const main = dictionaries.hant;
  const longer = chooseFromWords(main, chars, position, 3);
  return longer ?? cantonese.words.get(chars[position] ?? "");
}

function convertLine(line: string, target: Target) {
  const dictionary = dictionaries[target];
  const foreign = target === "hant" ? onlyIn.hans : onlyIn.hant;
  const settled = scriptOf(line) === target;
  const chars = [...line];
  const spoken = target === "hant" && cantoneseMarks.test(line);
  return chars
    .map((char, position) => {
      const nuanced = dictionary.words.has(char);
      if (settled && !foreign.has(char)) {
        const usuallyChanges = nuanced && dictionary.words.get(char) !== char;
        return (
          (usuallyChanges && chooseFromWords(dictionary, chars, position, 2)) ||
          char
        );
      }
      if (spoken && cantonese.words.has(char)) {
        return chooseInCantonese(chars, position) ?? char;
      }
      return (
        dictionary.chars.get(char) ??
        (nuanced
          ? chooseFromWords(dictionary, chars, position, 1)
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
