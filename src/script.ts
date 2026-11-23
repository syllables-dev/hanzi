import { type Dictionary, dictionaries } from "@/dictionary";

export type { Target } from "@/dictionary";

export type Script = "hans" | "hant" | "both" | "none";

function ownCharacters({ chars, words }: Dictionary) {
  const kept = new Set<string>();
  const sources = new Set<string>();
  for (const [source, output] of [...chars, ...words]) {
    const outputs = [...output];
    [...source].forEach((char, index) => {
      sources.add(char);
      if (outputs[index] === char) {
        kept.add(char);
      }
    });
  }
  return new Set([...sources].filter((char) => !kept.has(char)));
}

export const onlyIn = {
  hans: ownCharacters(dictionaries.hant),
  hant: ownCharacters(dictionaries.hans),
};

const han = /\p{Script=Han}/u;

export function scriptOf(text: string): Script {
  let hans = 0;
  let hant = 0;
  let shared = false;
  for (const char of text) {
    if (onlyIn.hans.has(char)) {
      hans += 1;
    } else if (onlyIn.hant.has(char)) {
      hant += 1;
    } else if (han.test(char)) {
      shared = true;
    }
  }
  if (hans !== hant) {
    return hans > hant ? "hans" : "hant";
  }
  return hans > 0 || shared ? "both" : "none";
}
