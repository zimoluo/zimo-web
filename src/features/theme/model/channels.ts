import { AppError } from "../../../lib/errors";
import { orientedSurface, selectedAppearance, selectRoles } from "./resolve";
import type { ChannelPaint, ColorChannel, ColorRef, RoleMap, Scheme, ThemeSource } from "./types";

type Appearance = Pick<ThemeSource, "surfaces" | "backdrop" | "mark"> & { roles: RoleMap };
type Path = readonly (string | number)[];
const keyOf = (path: Path) => path.join(".");
const isPaint = (value: unknown): value is ColorRef => typeof value === "object" && value !== null && "kind" in value && ["literal", "tone", "role", "channel"].includes(String(value.kind));
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function walk(value: unknown, visit: (value: ColorRef, path: Path) => unknown, path: Path = []): unknown {
  if (isPaint(value)) return visit(value, path);
  if (Array.isArray(value)) return value.map((item, index) => walk(item, visit, [...path, index]));
  if (typeof value !== "object" || value === null) return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, walk(item, visit, [...path, key])]));
}

function appearanceOf(source: ThemeSource, scheme: Scheme): Appearance {
  const selected = selectedAppearance(source, scheme);
  const roles = selectRoles(selected, scheme);
  const surfaces = Object.fromEntries(Object.entries(selected.surfaces ?? {}).map(([role, surface]) =>
    [role, orientedSurface(surface, selected, scheme, true).surface]));
  return copy({
    roles: Object.fromEntries(Object.entries(roles).map(([key, value]) =>
      [key, typeof value === "number" ? { kind: "tone", at: value } : value])) as RoleMap,
    surfaces,
    ...(selected.backdrop === undefined ? {} : { backdrop: selected.backdrop }),
    ...(selected.mark === undefined ? {} : { mark: selected.mark }),
  });
}

const signature = (value: unknown): string => JSON.stringify(value, (_, item: unknown) => typeof item === "object" && item !== null && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);

function labelOf(path: Path): string {
  if (path[0] === "roles") return String(path[1]).replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`);
  return path.filter((part) => !["layers", "stops", "color", "palette", "scenes", "gradients"].includes(String(part))).map((part) => typeof part === "number" ? part + 1 : part).join(" · ");
}

export function channelizeTheme(source: ThemeSource): ThemeSource {
  if (Object.keys(source.channels ?? {}).length > 0) return source;
  const schemes: readonly Scheme[] = source.schemes.kind === "single" ? [source.schemes.scheme] : ["light", "dark"];
  const native = source.surfaceScheme ?? schemes[0]!;
  const appearances = Object.fromEntries(schemes.map((scheme) => [scheme, appearanceOf(source, scheme)])) as Partial<Record<Scheme, Appearance>>;
  const paints = new Map<string, { path: Path; refs: Partial<Record<Scheme, ColorRef>> }>();
  for (const scheme of schemes) walk(appearances[scheme], (ref, path) => {
    if (ref.kind !== "tone" && ref.kind !== "literal") return ref;
    const key = keyOf(path), pair = paints.get(key) ?? { path, refs: {} };
    pair.refs[scheme] = ref;
    paints.set(key, pair);
    return ref;
  });
  const channels: Record<string, ColorChannel> = {};
  const shared = new Map<string, string>(), bindings = new Map<string, string>();
  for (const [path, { path: parts, refs }] of paints) {
    const identity = signature(refs);
    let id = shared.get(identity);
    if (id === undefined) {
      const name = labelOf(parts);
      const stem = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      id = stem; let suffix = 1;
      while (Object.hasOwn(channels, id)) id = `${stem}-${++suffix}`;
      const base = refs[native] ?? refs[schemes[0]!] ?? Object.values(refs)[0]!;
      const overrides = Object.fromEntries(Object.entries(refs).filter(([, ref]) => signature(ref) !== signature(base)));
      channels[id] = { name, source: base as ChannelPaint, ...(Object.keys(overrides).length === 0 ? {} : { appearance: overrides as Partial<Record<Scheme, ChannelPaint>> }) };
      shared.set(identity, id);
    }
    bindings.set(path, id);
  }
  if (Object.keys(channels).length > 128) throw new AppError("invalid-request", "This theme has more than 128 distinct color families; organize a smaller palette first");
  const normalized = Object.fromEntries(schemes.map((scheme) => [scheme, walk(appearances[scheme], (ref, path) => {
    const channel = bindings.get(keyOf(path));
    return channel === undefined || (ref.kind !== "tone" && ref.kind !== "literal") ? ref : { kind: "channel", channel };
  })])) as Partial<Record<Scheme, Appearance>>;
  const base = normalized[native] ?? normalized[schemes[0]!]!;
  const overrides: NonNullable<ThemeSource["appearance"]> = Object.fromEntries(schemes.map((scheme) => [scheme, Object.fromEntries((["surfaces", "backdrop", "mark"] as const).filter((key) => signature(normalized[scheme]![key]) !== signature(base[key])).map((key) => [key, normalized[scheme]![key]]))] as const).filter(([, value]) => Object.keys(value).length > 0));
  const { appearance: _appearance, ...rest } = source;
  return { ...rest, channels, schemes: source.schemes.kind === "single" ? { ...source.schemes, roles: base.roles } : { ...source.schemes, light: normalized.light!.roles, dark: normalized.dark!.roles }, ...base.surfaces === undefined ? {} : { surfaces: base.surfaces as NonNullable<ThemeSource["surfaces"]> }, ...base.backdrop === undefined ? {} : { backdrop: base.backdrop }, ...base.mark === undefined ? {} : { mark: base.mark }, ...(Object.keys(overrides).length === 0 ? {} : { appearance: overrides }) };
}

export function channelUsePaths(source: ThemeSource, id: string): readonly string[] {
  const paths: string[] = [];
  walk(source, (ref, path) => { if (ref.kind === "channel" && ref.channel === id) paths.push(keyOf(path)); return ref; });
  return paths;
}
