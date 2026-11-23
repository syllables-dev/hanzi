import {
  cantonese,
  type Dictionary,
  dictionaries,
  type Target,
  type WordNode,
} from "@/dictionary";
import { onlyIn, scriptOf } from "@/script";

const cantoneseMarks =
  /[嘅咗啲喺嗰冇唔佢哋嚟咩嘢乜噉啱㗎喎嚿瞓攞揾搵谂諗畀睇冧嬲]/u;

function chooseFromWords(
  { longest, trie }: Dictionary,
  chars: string[],
  position: number,
  shortest: number
) {
  let bestLength = shortest - 1;
  let bestStart = position;
  let bestOutput: string[] | undefined;
  const first = Math.max(0, position - longest + 1);
  for (let start = position; start >= first; start -= 1) {
    let node: WordNode | undefined = trie;
    for (let end = start; end < chars.length; end += 1) {
      node = node.next.get(chars[end] ?? "");
      if (node === undefined) {
        break;
      }
      const length = end - start + 1;
      if (node.output && end >= position && length > bestLength) {
        bestLength = length;
        bestStart = start;
        bestOutput = node.output;
      }
    }
  }
  return bestOutput?.[position - bestStart];
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
        return (
          chooseFromWords(cantonese, chars, position, 2) ??
          chooseFromWords(dictionary, chars, position, 3) ??
          cantonese.words.get(char)
        );
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
