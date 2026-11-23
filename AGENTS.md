# @syllables-dev/hanzi

Simplified and Traditional Chinese script detection and conversion. Traditional output follows the Hong Kong glyph standard (`裏`, `綫`, `着`). It converts characters only, never vocabulary: `软件` becomes `軟件`, not `軟體`.

Conversion is a plain dictionary, no model. Most characters have one counterpart and convert by lookup. The few hundred that depend on the word around them (`发` as `發` or `髮`) have a default and a list of words that need a different form.

## Layout

- `src/detect.ts`, `src/hans.ts` and `src/hant.ts` are the entry points `@syllables-dev/hanzi/detect`, `/hans` and `/hant`. `src/index.ts` adds `convert(text, target)` over both.
- `src/data/<direction>/chars.tsv` maps each character that has exactly one counterpart, source then output. Characters missing from both files of a direction stay as they are.
- `src/data/<direction>/words.tsv` is the dictionary for characters whose form depends on the word. Each character gets a section: a `#` line naming it and its possible outputs, a line with the character alone giving its default, then the words that need something else, shortest first.

  ```
  # 发 發 髮
  发	發
  头发	頭髮
  理发	理髮
  ```

- `src/dictionary.ts` reads both directions. `src/convert.ts` converts a line: a character in `chars.tsv` is looked up; a character with a section in `words.tsv` takes its form from the longest entry covering it, falling back to its default; anything else stays. In a line already in the target script, only characters of the other script convert, so `皇后` in a Traditional line stays `皇后`.
- `src/script.ts` decides a line's script. A character belongs to one script when no entry of its direction ever keeps it unchanged: `发` always becomes `發` or `髮`, so it is Simplified. `乾` stays in `乾隆`, so it is shared. The script with more of its own characters wins; a line with none of either, but some Han, is `both`.

## The dictionary

- The data was generated once, then is edited by hand. The character tables came from Unihan and OpenCC, with Hong Kong glyphs, one modern form for pairs Hong Kong text uses interchangeably (`台` over `臺`, `煙` over `菸`), and rare candidates removed. The words in `to-hant` were counted from about 90 million characters of Traditional text and lyrics: a word was kept when it appeared at least 3 times, gave the same form at least 80% of the time, and changed what the shorter entries would give. The `to-hans` words are hand-picked spellings such as `乾隆` and `一目了然`.
- To fix a wrong conversion, add the shortest word that settles it to the character's section, then add the case to `tests/convert.test.ts`. A longer entry always wins over a shorter one, and the character alone is the default.
- To change a character's default, edit its single-character line. Check the section's words still make sense, since they were kept only where they differed from the old default.
- `著` stays `著` in Simplified; `着` stays `着`.
- Never add a regional vocabulary change (`軟件` to `軟體`). Only the character's form is decided here.

## Rules

- Always use the Bun toolchain: `bun` and `bunx`. Never `node`, `npm`, `pnpm`, or `npx`.
- Do not use em dashes anywhere.
- Zero runtime dependencies.
- Named exports only. No `utils.ts`; shared code gets a descriptive name.
- Import through the `@/` alias, never `./` or `../`. `@/` maps to `src/`.
- Do not set `sideEffects: false` in package.json: Bun's bundler then drops re-exported modules.
- Kebab-case file names, camelCase variables and functions, PascalCase types. No snake_case and no SCREAMING_SNAKE_CASE.
- Do not add comments. A comment may only state what the code cannot: a data quirk, an invariant, a why. Lowercase, one line, no full stop.
- No `any`. Keep `as` casts at boundaries only.
- Generic names are banned: `data`, `result`, `item`, `temp`, `obj`, `helper`, `process`, `handle`.
- Never commit lyrics or downloaded corpora.

## Tests

- Every test must protect a real behavior: a conversion a reader would notice or a data quirk.
- Test through the public entry points.

## Code quality

After any change:

1. `bun tsgo`
2. `bun fix`
3. `bun test`

Rerun until all three pass in the same round.
