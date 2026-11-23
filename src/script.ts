import { type Dictionary, dictionaries } from "@/dictionary";

export type Script = "hans" | "hant" | "both" | "none";

const han = /\p{Script=Han}/u;

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
  return {
    always: new Set([...sources].filter((char) => !kept.has(char))),
    usually: new Set(
      [...kept].filter(
        (char) =>
          words.has(char) && (chars.get(char) ?? words.get(char)) !== char
      )
    ),
  };
}

const own = {
  hans: ownCharacters(dictionaries.hant),
  hant: ownCharacters(dictionaries.hans),
};

export const onlyIn = { hans: own.hans.always, hant: own.hant.always };

export function scriptOf(text: string): Script {
  const counts = { hans: 0, hansUsually: 0, hant: 0, hantUsually: 0 };
  let shared = false;
  for (const char of text) {
    if (own.hans.always.has(char)) {
      counts.hans += 1;
    } else if (own.hant.always.has(char)) {
      counts.hant += 1;
    } else if (own.hans.usually.has(char)) {
      counts.hansUsually += 1;
    } else if (own.hant.usually.has(char)) {
      counts.hantUsually += 1;
    } else if (han.test(char)) {
      shared = true;
    }
  }
  if (counts.hans !== counts.hant) {
    return counts.hans > counts.hant ? "hans" : "hant";
  }
  if (counts.hansUsually !== counts.hantUsually) {
    return counts.hansUsually > counts.hantUsually ? "hans" : "hant";
  }
  return counts.hans > 0 || shared || counts.hansUsually > 0 ? "both" : "none";
}
