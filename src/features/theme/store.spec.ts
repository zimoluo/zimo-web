import { beforeEach, describe, expect, it } from "vitest";
import { getTheme, themeIds } from "./registry";
import { DEFAULT_ROUTE_THEMES, DEFAULT_THEME_ID, useTheme } from "./store";

const reset = (): void => {
  useTheme.setState({
    active: { kind: "builtIn", id: DEFAULT_THEME_ID },
    scheme: "light",
    schemePreference: "system",
    profiles: [],
    seasonal: true,
    byRoute: {},
    route: "home",
  });
};

describe("themeStore", () => {
  beforeEach(reset);

  it("starts on a built-in theme that exists in the registry", () => {
    const { active } = useTheme.getState();
    expect(active.kind).toBe("builtIn");
    if (active.kind === "builtIn") {
      expect(themeIds).toContain(active.id);
    }
  });

  it("retains the original page identities and restores a route's saved selection", () => {
    for (const [route, id] of Object.entries(DEFAULT_ROUTE_THEMES)) {
      useTheme.getState().selectRoute(route as keyof typeof DEFAULT_ROUTE_THEMES);
      expect(useTheme.getState().active).toEqual({ kind: "builtIn", id });
    }
    useTheme.getState().selectRoute("notebook");
    useTheme.getState().selectBuiltIn("stars");
    useTheme.getState().selectRoute("design");
    expect(useTheme.getState().active).toEqual({ kind: "builtIn", id: "velvet" });
    useTheme.getState().selectRoute("notebook");
    expect(useTheme.getState().active).toEqual({ kind: "builtIn", id: "stars" });
  });

  it("selects a built-in theme by id", () => {
    useTheme.getState().selectBuiltIn("velvet");
    expect(useTheme.getState().active).toEqual({ kind: "builtIn", id: "velvet" });
  });

  it("accepts a valid profile and rejects an invalid one", () => {
    const store = useTheme.getState();

    expect(store.addProfile(getTheme("velvet")).ok).toBe(true);
    expect(useTheme.getState().profiles).toHaveLength(1);

    const bad = useTheme.getState().addProfile({ formatVersion: 2, id: "Bad Id" });
    expect(bad.ok).toBe(false);
    expect(bad.issues?.length ?? 0).toBeGreaterThan(0);
    expect(useTheme.getState().profiles).toHaveLength(1);
  });

  it("lifts a v1 profile on import, per T9 §8", () => {
    const legacy = {
      palette: {
        primary: [112, 26, 117],
        saturated: [162, 28, 175],
        pastel: [245, 208, 254],
        light: [253, 244, 255],
        page: [
          {
            type: "linear-gradient",
            angle: 45,
            stops: [{ color: [249, 232, 255], opacity: 1, at: 20 }],
          },
        ],
        widget: [
          {
            type: "linear-gradient",
            angle: 45,
            stops: [{ color: [253, 244, 255], opacity: 1, isWidgetOpacity: true, at: 20 }],
          },
        ],
      },
      siteThemeColor: "#f5d0fe",
      favicon: { mode: "separate" },
    };

    expect(useTheme.getState().addProfile(legacy).ok).toBe(true);
    expect(useTheme.getState().profiles[0]?.formatVersion).toBe(2);
  });

  it("selects a profile by index and ignores an out-of-range one", () => {
    const store = useTheme.getState();
    store.addProfile(getTheme("velvet"));

    useTheme.getState().selectProfile(0);
    expect(useTheme.getState().active).toEqual({ kind: "profile", index: 0 });

    useTheme.getState().selectProfile(9);
    expect(useTheme.getState().active).toEqual({ kind: "profile", index: 0 });

    useTheme.getState().selectProfile(-1);
    expect(useTheme.getState().active).toEqual({ kind: "profile", index: 0 });
  });

  it("falls back to a built-in theme when the active profile is removed", () => {
    useTheme.getState().addProfile(getTheme("velvet"));
    useTheme.getState().selectProfile(0);
    useTheme.getState().removeProfile(0);

    expect(useTheme.getState().profiles).toHaveLength(0);
    expect(useTheme.getState().active).toEqual({ kind: "builtIn", id: DEFAULT_THEME_ID });
  });

  it("ignores a removal outside the profile range", () => {
    useTheme.getState().addProfile(getTheme("velvet"));
    useTheme.getState().removeProfile(5);
    expect(useTheme.getState().profiles).toHaveLength(1);
  });

  it("replaces a profile in place", () => {
    useTheme.getState().addProfile(getTheme("velvet"));
    useTheme.getState().replaceProfile(0, getTheme("blog"));
    expect(useTheme.getState().profiles[0]?.id).toBe("blog");

    useTheme.getState().replaceProfile(9, getTheme("velvet"));
    expect(useTheme.getState().profiles).toHaveLength(1);
  });

  it("an explicit scheme preference pins the scheme", () => {
    useTheme.getState().setSchemePreference("dark");
    expect(useTheme.getState().scheme).toBe("dark");
    expect(useTheme.getState().schemePreference).toBe("dark");
  });

  it("a system preference leaves the scheme for the host to decide", () => {
    useTheme.getState().setScheme("dark");
    useTheme.getState().setSchemePreference("system");
    expect(useTheme.getState().schemePreference).toBe("system");
    expect(useTheme.getState().scheme).toBe("dark");
  });

  it("toggles the seasonal opt-out that replaced disableSpecialTheme", () => {
    useTheme.getState().setSeasonal(false);
    expect(useTheme.getState().seasonal).toBe(false);
  });

  it("D5 C1: a selector subscription fires only for the value it selects", () => {
    let schemeNotifications = 0;
    const unsubscribe = useTheme.subscribe(
      (state) => state.scheme,
      () => {
        schemeNotifications += 1;
      },
    );

    useTheme.getState().setSeasonal(false);
    useTheme.getState().selectBuiltIn("velvet");
    expect(schemeNotifications).toBe(0);

    useTheme.getState().setScheme("dark");
    expect(schemeNotifications).toBe(1);

    unsubscribe();
  });
});
