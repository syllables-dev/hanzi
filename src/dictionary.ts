import hansChars from "@/data/to-hans/chars.tsv" with { type: "text" };
import hansWords from "@/data/to-hans/words.tsv" with { type: "text" };
import hantChars from "@/data/to-hant/chars.tsv" with { type: "text" };
import hantWords from "@/data/to-hant/words.tsv" with { type: "text" };

export type Target = "hans" | "hant";

export interface Dictionary {
  chars: ReadonlyMap<string, string>;
  longest: number;
  words: ReadonlyMap<string, string>;
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
    words,
  };
}

export const dictionaries: Record<Target, Dictionary> = {
  hans: readDictionary(hansChars, hansWords),
  hant: readDictionary(hantChars, hantWords),
};
