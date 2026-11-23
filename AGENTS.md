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

- `src/data/to-hant/cantonese.tsv` applies only to lines with colloquial Cantonese marks (`嘅 咗 啲 喺 唔 佢 哋 冇 嘢 睇` and a few more). Cantonese writes `係` (is) and `隻` (a classifier) where Mandarin words would read `系` and `只`, as in `梗系上集好睇`. A single character there beats two-character words of `words.tsv`; its own words and longer main words still win, so `系統` and `只有` stay.
- `src/dictionary.ts` reads both directions. `src/convert.ts` converts a line: a character in `chars.tsv` is looked up; a character with a section in `words.tsv` takes its form from the longest entry covering it, preferring among equally long entries the one starting nearest the character, and falls back to its default; anything else stays. In a line already in the target script, a character the other script also uses changes only when a word covers it and its default would change it too, so `我們心里` becomes `我們心裏` while `皇后` and `情難自制` stay.
- `src/script.ts` decides a line's script. A character belongs to one script when no entry of its direction ever keeps it unchanged: `发` always becomes `發` or `髮`, so it is Simplified. Characters a few words keep, such as `后` in `皇后` or `乾` in `乾隆`, only decide a line with no stronger character. The script with more of its own characters wins; a line with none of either, but some Han, is `both`.

## The dictionary

- The data was generated once, then is edited by hand. The character tables came from Unihan and OpenCC, with Hong Kong glyphs, one modern form for pairs Hong Kong text uses interchangeably (`台` over `臺`, `煙` over `菸`), and rare candidates removed. To-Simplified never turns a common character into a rare one, so Cantonese `嗰`, `攞` and `喎` stay, and no mapping turns one Traditional form into another (`苧` stays `苧`, `幺` stays `幺`).
- Each character's default is its most common form, except where lyrics need otherwise (`里` defaults to `裏`, `斗` to `鬥`, `干` to `乾`).
- The words come from CC-CEDICT, mapped to Hong Kong glyphs. Where CEDICT gives two Traditional spellings, the one Hong Kong text uses more wins; going to Simplified, CEDICT's main entry wins over one it marks as a variant. On top of that sit words counted from about 90 million characters of Traditional text and lyrics, kept only where they fix what CEDICT gets wrong, appear at least 10 times outside Wikipedia, at least three times as often as the form without them, and do not end on the character they change (a window like `于没有注` cuts `注意` in half). Then reviewed fixes for lyrics and Cantonese (`鍾意`, `秘書台`, `張枱`, `後悔`, `餵飯`, `佔滿`).
- Meaning splits follow BYVoid's 《現代漢語常用簡繁一對多字義辨析表》 (the table OpenCC is built on, https://ytenx.org/byohlyuk/KienxPyan) and CUHK's note on `儘` and `盡` (`儘` for "as far as possible": `儘管`, `儘快`, `儘量`, `儘早`; `盡` for "use up": `盡力`, `盡情`). Where Hong Kong text and lyrics differ from that Taiwan-based table, Hong Kong wins: `世界杯`, `獎杯`, `核實`, `局限`, `背負`, `抵觸`, `喧嘩`, `酸痛`, `人參`, `傢俬`. 中華書局's 《簡繁轉換一本通》 (2022) is the Hong Kong reference for these 234 groups, such as popcorn staying `爆谷`.
- Words that agree with the default are listed only where they guard against an overlapping word that disagrees, such as `只是` against `千只`. Where two such words still collide, a longer entry settles it with the reading real text uses more, such as `頭髮白` over `頭發白`.
- Short entries that keep a character unchanged, such as `公里` or `北斗`, are exceptions to a default: `里` becomes `裏` unless a word says otherwise.
- To fix a wrong conversion, add the shortest word that settles it to the character's section. A longer entry always wins over a shorter one, and the character alone is the default. A Cantonese-only fix goes in `cantonese.tsv`.
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

## Code quality

After any change:

1. `bun run tsgo`
2. `bun fix`

Rerun until both pass in the same round.
