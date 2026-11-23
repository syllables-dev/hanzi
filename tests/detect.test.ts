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

test("counts characters that stay unchanged in simplified words as shared", () => {
  expect(detect("乾隆著作")).toBe("both");
});

test("lets the script with more of its own characters win a mixed line", () => {
  expect(detect("國王與皇后们")).toBe("hant");
});
