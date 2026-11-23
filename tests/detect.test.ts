import { expect, test } from "bun:test";
import { detect } from "@/detect";

test("names the script a line is written in", () => {
  expect(
    detect([
      "我们回家吧",
      "我們回家吧",
      "天地玄黃",
      "人山人海",
      "Hello, world 123",
    ])
  ).toEqual(["hans", "hant", "hant", "both", "none"]);
});

test("lets characters a few words keep decide when nothing else does", () => {
  expect(detect(["以后", "干杯", "乾杯", "於是"])).toEqual([
    "hans",
    "hans",
    "hant",
    "hant",
  ]);
});

test("lets the script with more of its own characters win a mixed line", () => {
  expect(detect("國王與皇后们")).toBe("hant");
});
