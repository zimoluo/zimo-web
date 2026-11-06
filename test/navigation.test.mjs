import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

async function load(file) {
  const source = await readFile(new URL(file, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}
const { parseSearchQuery, scoreSearchItem, normalizeSearchEntry } = await load("../lib/searchUtil.ts");
const { calculateNavbarLayout } = await load("../lib/navbarLayout.ts");
const item = { title: "A Landmark of Design", description: "An informal portfolio", tags: ["Design", "Writing"], authors: ["Zimo Luo"] };
const matches = (query, value = item) => scoreSearchItem(value, parseSearchQuery(query)) !== null;

test("search combines words and filters, supports quoted phrases and CJK separators", () => {
  for (const query of ["landmark design", '"landmark of"', "#design，:zimo；-draft", "portfolio, -#draft", "#，:；-", ""]) assert(matches(query), query);
  for (const query of ["design missing", '"design landmark"', "-landmark", "-#design", "-:zimo", "#draft"]) assert(!matches(query), query);
  assert(matches("cafe", { title: "Café" }));
  assert(matches("中文", { title: "中文标题" }));
});

test("exact titles rank ahead of prefix, substring, keywords and descriptions", () => {
  const terms = parseSearchQuery("design");
  const items = [{ title: "Design" }, { title: "Design systems" }, { title: "A Design system" }, { title: "Redesign" }, { title: "Other", keywords: ["design"] }, { title: "Other", description: "Design" }];
  assert.deepEqual(items.map((value) => scoreSearchItem(value, terms)), [0, 1, 2, 3, 4, 5]);
});

test("public summaries omit unlisted or malformed entries and project only metadata", () => {
  const plain = (value) => value.replaceAll("*", "");
  const entry = { slug: "hello-world", title: "*Hello*", description: "A\npost", author: "Zimo", tags: ["Design"], content: "private body", images: ["large"], unlisted: false };
  const result = normalizeSearchEntry("blog", entry, plain);
  assert.deepEqual(result, { section: "blog", slug: "hello-world", title: "Hello", description: "A post", tags: ["Design"], authors: ["Zimo"], date: "" });
  for (const invalid of [{ unlisted: true }, { title: "" }, { slug: "../secret" }, { slug: "hello?x" }, { slug: "" }]) assert.equal(normalizeSearchEntry("blog", { ...entry, ...invalid }, plain), null);
  assert.equal(normalizeSearchEntry("photos", { ...entry, description: "", location: { name: "Chicago", latitude: 42, longitude: -87 } }, plain).description, "Chicago");
  assert.deepEqual(normalizeSearchEntry("projects", { ...entry, authors: ["Zimo", { name: "Guest" }, null, 42] }, plain).authors, ["Zimo", "Guest"]);
});

test("navbar controls remain inside the available region and never overlap at rest", () => {
  for (let width = 280; width <= 2560; width += 1) for (const menuExpanded of [false, true]) for (const navbarExpanded of [false, true]) {
    const layout = calculateNavbarLayout({ width, menuExpanded, navbarExpanded });
    if (!layout.visible) continue;
    const label = JSON.stringify({ width, menuExpanded, navbarExpanded });
    assert(layout.searchWidth >= 100, label);
    assert(layout.searchLeft >= 0 && layout.searchLeft + layout.searchWidth <= layout.span, label);
    if (layout.windows) assert(layout.searchTop > 62 || layout.searchLeft + layout.searchWidth <= layout.windowLeft - 16, label);
    if (navbarExpanded && layout.mode === "inline") {
      assert(layout.searchLeft >= layout.destinationLeft + 234 + (layout.labels ? 72 : 0) + 16, label);
    }
    if (layout.mode === "stacked") assert(layout.searchTop >= 68, label);
  }
});

test("phone search substitutes for collapsed destinations and desktop menus preserve a corridor", () => {
  const expanded = calculateNavbarLayout({ width: 390, menuExpanded: false, navbarExpanded: true });
  const collapsed = calculateNavbarLayout({ width: 390, menuExpanded: false, navbarExpanded: false });
  assert.equal(expanded.mode, "stacked"); assert.equal(expanded.searchWidth, 370);
  assert.equal(collapsed.mode, "substituted"); assert.equal(collapsed.searchTop, 10);
  assert.equal(calculateNavbarLayout({ width: 1024, menuExpanded: true, navbarExpanded: true }).visible, false);
  assert.equal(calculateNavbarLayout({ width: 1440, menuExpanded: true, navbarExpanded: true }).visible, true);
});


test("desktop scroll collapse never relocates or stretches search", () => {
  for (let width = 640; width <= 2560; width++) for (const menuExpanded of [false, true]) {
    const open = calculateNavbarLayout({ width, menuExpanded, navbarExpanded: true });
    const closed = calculateNavbarLayout({ width, menuExpanded, navbarExpanded: false });
    assert.deepEqual([closed.searchLeft, closed.searchTop, closed.searchWidth], [open.searchLeft, open.searchTop, open.searchWidth], `${width}, sidebar=${menuExpanded}`);
  }
});
