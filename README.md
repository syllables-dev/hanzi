# hanzi

Detects and converts between Simplified and Traditional Chinese script, writing Traditional in the Hong Kong glyph standard.

> [!NOTE]
> Private. Published only to GitHub Packages.

## Install

```sh
bun add @syllables-dev/hanzi
```

## Usage

```ts
import { detect } from "@syllables-dev/hanzi/detect";
import { toHant } from "@syllables-dev/hanzi/hant";

detect("头发很长"); // "hans"
toHant("头发很长"); // "頭髮很長"
```

## Fixing a conversion

Find the character's section in `src/data/to-hant/words.tsv` (or `to-hans`), add the word with its right form, and add a test. See `AGENTS.md`.

## Development

```sh
bun install
bun test
bun run check
bun run tsgo
```

## License

Proprietary.
