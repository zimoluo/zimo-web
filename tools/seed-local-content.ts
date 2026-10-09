import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve as resolvePath } from "node:path";
import { resolveAuthor } from "@/src/features/entries/authors";
import { buildIndex } from "@/src/features/entries/index-build";
import type { StoredEntry } from "@/src/features/entries/model/schema";
import type { Slug } from "@/src/features/entries/model/ids";
import { SECTIONS } from "@/src/features/entries/model/types";
import type { ImageAsset, Section } from "@/src/features/entries/model/types";
import { keys } from "@/src/server/storage/keys";
import { DEFAULT_LOCAL_ROOT, LOCAL_ROOT_VARIABLE } from "@/src/server/storage/local-store";

const BUILT_AT = "2026-01-01T00:00:00Z";

const AUTHOR = resolveAuthor("zimo");

const cover = (slug: string): ImageAsset => ({
  src: `https://picsum.photos/seed/${slug}/1600/900`,
  width: 1600,
  height: 900,
  alt: `A placeholder cover for ${slug}`,
});

const DOCUMENT = (title: string): string => `# ${title}

This entry is **synthesized** for local development. It exists so every route can
render without network access and without credentials.

## What is real here

The shape is real: the same schema the bucket holds, the same index the listing
reads, and the same slug validation. Only the content is invented.

- inline marks: *emphasis*, \`code\`, ==a mark==, ~~struck~~
- a [link](/blog)

## A second section

Two headings are enough for the table of contents to have something to show.
`;

type Seed = {
  readonly section: Section;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly publishedAt: string;
  readonly tags: readonly string[];
};

const SEEDS: readonly Seed[] = [
  {
    section: "blog",
    slug: "on-gradients",
    title: "On gradients",
    description: "A study of **layered** paint and where the light lands.",
    publishedAt: "2026-03-04T00:00:00Z",
    tags: ["Design", "Color"],
  },
  {
    section: "blog",
    slug: "window-metaphors",
    title: "Window metaphors on the web",
    description: "Why a desktop metaphor still earns its keep.",
    publishedAt: "2026-01-18T00:00:00Z",
    tags: ["Engineering"],
  },
  {
    section: "album",
    slug: "kyoto-in-spring",
    title: "Kyoto in spring",
    description: "Four days of rain and one afternoon of sun.",
    publishedAt: "2026-04-11T00:00:00Z",
    tags: ["Travel"],
  },
  {
    section: "projects",
    slug: "zimo-web",
    title: "Zimo Web",
    description: "This site, rebuilt.",
    publishedAt: "2025-12-01T00:00:00Z",
    tags: ["Engineering", "Design"],
  },
  {
    section: "management",
    slug: "privacy",
    title: "Privacy",
    description: "What this site stores and what it does not.",
    publishedAt: "2025-06-01T00:00:00Z",
    tags: [],
  },
];

const extrasFor = (section: Section, slug: string): StoredEntry["extras"] => {
  switch (section) {
    case "album":
      return {
        section: "album",
        place: { latitude: 35.0116, longitude: 135.7681, name: "Kyoto" },
      };
    case "projects":
      return {
        section: "projects",
        links: [
          {
            label: "Source",
            url: "https://github.com/zimoluo/zimo-web",
            kind: "source",
          },
        ],
        icon: cover(`${slug}-icon`),
      };
    case "blog":
      return { section: "blog" };
    case "management":
      return { section: "management" };
  }
};

const entryFor = (seed: Seed): StoredEntry => ({
  section: seed.section,
  slug: seed.slug as Slug,
  title: seed.title,
  description: seed.description,
  publishedAt: seed.publishedAt,
  unlisted: false,
  tags: seed.tags,
  authors: [AUTHOR],
  cover: cover(seed.slug),
  images: [cover(seed.slug), cover(`${seed.slug}-2`)],
  extras: extrasFor(seed.section, seed.slug),
});

const write = (root: string, key: string, body: string): void => {
  const path = join(root, key);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body, "utf8");
  console.log(`  ${key}`);
};

function main(argv: readonly string[]): number {
  const target = argv.find((arg) => !arg.startsWith("--"));
  const root = resolvePath(
    target ?? process.env[LOCAL_ROOT_VARIABLE] ?? DEFAULT_LOCAL_ROOT,
  );

  console.log(`=== seeding ${root}`);

  const entries = SEEDS.map(entryFor);

  for (const entry of entries) {
    write(root, keys.entry(entry.section, entry.slug), documentOrJson(entry));

    if (keys.entry(entry.section, entry.slug).endsWith(".md")) {
      write(
        root,
        `${keys.entryPrefix(entry.section)}${entry.slug}.meta.json`,
        `${JSON.stringify({ schema: 2, ...entry }, null, 2)}\n`,
      );
    }

    write(
      root,
      keys.commentThread(entry.section, entry.slug),
      `${JSON.stringify({ comments: [] }, null, 2)}\n`,
    );

    write(
      root,
      keys.reactions(entry.section, entry.slug),
      `${JSON.stringify({ likedBy: [] }, null, 2)}\n`,
    );
  }

  for (const section of SECTIONS) {
    const forSection = entries.filter((entry) => entry.section === section);
    write(
      root,
      keys.sectionIndex(section),
      `${JSON.stringify(buildIndex(section, forSection, BUILT_AT), null, 2)}\n`,
    );
  }

  write(
    root,
    "home/slide.json",
    `${JSON.stringify(
      {
        schema: 2,
        featured: entries
          .filter((entry) => entry.section === "blog")
          .map((entry) => ({
            title: entry.title,
            description: entry.description ?? "",
            date: entry.publishedAt,
            slug: entry.slug,
            coverImage: entry.cover?.src ?? "",
            authorId: AUTHOR.id,
            author: AUTHOR.name,
          })),
        timeline: [
          { time: "2026-01-01", content: "v11 begins." },
          { time: "2025-01-01", content: "v10 shipped." },
        ],
      },
      null,
      2,
    )}\n`,
  );

  write(
    root,
    "about/intro.json",
    `${JSON.stringify(
      {
        schema: 2,
        intro: [
          "This introduction is synthesized for local development.",
          "It renders without network access and without credentials.",
        ],
      },
      null,
      2,
    )}\n`,
  );

  write(root, keys.homeMessages(), `${JSON.stringify({ comments: [] }, null, 2)}\n`);
  write(root, keys.treeMessages(), "{\"messages\":[]}\n");

  console.log(
    `\nseeded ${entries.length} entr${entries.length === 1 ? "y" : "ies"} across ${SECTIONS.length} sections.`,
  );
  console.log(
    `The app reads this whenever ZIMO_WEB_AWS_KEY_ID is absent, or always with ZIMO_WEB_LOCAL_STORAGE_ONLY=true.`,
  );

  return 0;
}

const documentOrJson = (entry: StoredEntry): string =>
  keys.entry(entry.section, entry.slug).endsWith(".md")
    ? DOCUMENT(entry.title)
    : `${JSON.stringify({ schema: 2, ...entry }, null, 2)}\n`;

try {
  process.exitCode = main(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 2;
}
