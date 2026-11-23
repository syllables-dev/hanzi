import hansChars from "@/data/to-hans/chars.tsv" with { type: "text" };
import hansWords from "@/data/to-hans/words.tsv" with { type: "text" };
import hantCantonese from "@/data/to-hant/cantonese.tsv" with { type: "text" };
import hantChars from "@/data/to-hant/chars.tsv" with { type: "text" };
import hantWords from "@/data/to-hant/words.tsv" with { type: "text" };

export type Target = "hans" | "hant";

export interface WordNode {
  next: Map<string, WordNode>;
  output?: string[];
}

export interface Dictionary {
  chars: ReadonlyMap<string, string>;
  longest: number;
  trie: WordNode;
  words: ReadonlyMap<string, string>;
}

function buildTrie(words: ReadonlyMap<string, string>) {
  const root: WordNode = { next: new Map() };
  for (const [word, output] of words) {
    let node = root;
    for (const char of word) {
      let child = node.next.get(char);
      if (child === undefined) {
        child = { next: new Map() };
        node.next.set(char, child);
      }
      node = child;
    }
    node.output = [...output];
  }
  return root;
}

function readPairs(tsv: string) {
  return new Map(
    tsv
      .split("\n")
      .filter((line) => line.length > 0 && !line.startsWith("#"))
      .map((line) => {
        const tab = line.indexOf("\t");
        return [line.slice(0, tab), line.slice(tab + 1)] as const;
      })
  );
}

function readDictionary(charsTsv: string, wordsTsv: string): Dictionary {
  const words = readPairs(wordsTsv);
  return {
    chars: readPairs(charsTsv),
    longest: Math.max(...[...words.keys()].map((word) => [...word].length)),
    trie: buildTrie(words),
    words,
  };
}

export const cantonese = readDictionary("", hantCantonese);

export const dictionaries = {
  hans: readDictionary(hansChars, hansWords),
  hant: readDictionary(hantChars, hantWords),
};
