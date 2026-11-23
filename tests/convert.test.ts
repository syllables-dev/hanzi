import { expect, test } from "bun:test";
import { convert } from "@/index";

test("converts characters, never vocabulary", () => {
  expect(convert("软件和鼠标", "hant")).toBe("軟件和鼠標");
  expect(convert("軟體和滑鼠", "hans")).toBe("软体和滑鼠");
});

test("writes traditional in the hong kong glyph standard", () => {
  expect(convert("线着说", "hant")).toBe("綫着説");
});

test("simplifies taiwan and hong kong glyphs alike", () => {
  expect(convert(["電線", "電綫"], "hans")).toEqual(["电线", "电线"]);
});

test("picks the form a word needs over the character's default", () => {
  expect(
    convert(["头发", "出发", "皇后", "以后", "干杯", "干活"], "hant")
  ).toEqual(["頭髮", "出發", "皇后", "以後", "乾杯", "幹活"]);
});

test("writes 里 as 裏 for inside but keeps it in distances", () => {
  expect(convert(["心里", "梦里", "一公里"], "hant")).toEqual([
    "心裏",
    "夢裏",
    "一公里",
  ]);
});

test("writes the modern hong kong form where both forms mean the same", () => {
  expect(convert(["台湾", "香烟", "了解"], "hant")).toEqual([
    "台灣",
    "香煙",
    "了解",
  ]);
});

test("keeps the reviewed lyric readings", () => {
  expect(convert(["我好后悔", "占卦", "扎稳马步", "吃晒"], "hant")).toEqual([
    "我好後悔",
    "占卦",
    "扎穩馬步",
    "吃晒",
  ]);
});

test("keeps 著 in simplified and leaves words that never simplify", () => {
  expect(convert(["笑著哭", "乾隆", "乾淨"], "hans")).toEqual([
    "笑著哭",
    "乾隆",
    "干净",
  ]);
});

test("writes the fighting 斗 as 鬥 but keeps the measuring one", () => {
  expect(convert(["战斗", "斗争", "北斗", "漏斗"], "hant")).toEqual([
    "戰鬥",
    "鬥爭",
    "北斗",
    "漏斗",
  ]);
});

test("keeps cantonese words in their hong kong spelling", () => {
  expect(convert(["我好钟意你", "秘书台", "张台", "里边"], "hant")).toEqual([
    "我好鍾意你",
    "秘書台",
    "張枱",
    "裏邊",
  ]);
});

test("picks the reading that fits common lyric words", () => {
  expect(
    convert(["面包", "回头", "幸福", "治愈", "向往", "肮脏", "吓我"], "hant")
  ).toEqual(["麵包", "回頭", "幸福", "治癒", "嚮往", "骯髒", "嚇我"]);
});

test("reads whole dictionary words instead of fragments around them", () => {
  expect(
    convert(
      [
        "国家制度",
        "这个里面",
        "洗完才干净",
        "午后钟声",
        "头发白了",
        "千只是梦",
      ],
      "hant"
    )
  ).toEqual([
    "國家制度",
    "這個裏面",
    "洗完才乾淨",
    "午後鐘聲",
    "頭髮白了",
    "千只是夢",
  ]);
});

test("writes 干 as 乾 unless a word needs 幹 or 干", () => {
  expect(
    convert(["眼泪流干", "干了这杯", "能干", "别再干傻事", "若干"], "hant")
  ).toEqual(["眼淚流乾", "乾了這杯", "能幹", "別再幹傻事", "若干"]);
});

test("covers common words from the dictionary", () => {
  expect(
    convert(
      [
        "形单影只",
        "系鞋带",
        "星系",
        "复习",
        "上游",
        "歌后",
        "方便面",
        "卷土重来",
      ],
      "hant"
    )
  ).toEqual([
    "形單影隻",
    "繫鞋帶",
    "星系",
    "複習",
    "上游",
    "歌后",
    "方便麵",
    "捲土重來",
  ]);
});

test("reads 系 as 係 and 只 as 隻 in colloquial cantonese", () => {
  expect(
    convert(
      ["梗系上集好睇", "我哋嗰只猫", "佢只系想你", "呢个系统唔得"],
      "hant"
    )
  ).toEqual(["梗係上集好睇", "我哋嗰隻貓", "佢只係想你", "呢個系統唔得"]);
});

test("keeps cantonese characters as they are going to simplified", () => {
  expect(convert(["嗰阵时", "攞晒", "系喎"], "hans")).toEqual([
    "嗰阵时",
    "攞晒",
    "系喎",
  ]);
});

test("never chains one traditional form into another", () => {
  expect(convert(["苧麻", "苎麻"], "hant")).toEqual(["苧麻", "苧麻"]);
  expect(convert("幺妹", "hans")).toBe("幺妹");
});

test("fixes shared characters in a traditional line only where a word says so", () => {
  expect(convert(["我們心里", "情難自制", "枱面的"], "hant")).toEqual([
    "我們心裏",
    "情難自制",
    "枱面的",
  ]);
});

test("leaves shared characters alone in a line already in the target script", () => {
  expect(convert("皇后與國王们", "hant")).toBe("皇后與國王們");
});

test("keeps line breaks and text that is not chinese", () => {
  expect(convert("Hello 世界!\r\n再见", "hant")).toBe("Hello 世界!\r\n再見");
});
