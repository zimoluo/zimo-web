import { beforeEach, describe, expect, it } from "vitest";
import { defaultSettings } from "./defaults";
import { useSettings } from "./store";

const reset = (): void => {
  useSettings.getState().replaceAll(defaultSettings);
};

describe("settingsStore", () => {
  beforeEach(reset);

  it("starts at the documented defaults", () => {
    expect(useSettings.getState().version).toBe(3);
    expect(useSettings.getState().reading.blur).toBe(defaultSettings.reading.blur);
  });

  it("patches one domain without disturbing the others", () => {
    const before = useSettings.getState().motion;
    useSettings.getState().setReading({ blur: 8 });

    expect(useSettings.getState().reading.blur).toBe(8);
    expect(useSettings.getState().reading.serif).toBe(defaultSettings.reading.serif);
    expect(useSettings.getState().motion).toEqual(before);
  });

  it("bumps the revision on every preference change, for D5 §5 conflict resolution", () => {
    const start = useSettings.getState().revision;
    useSettings.getState().setReading({ blur: 4 });
    useSettings.getState().setSound({ enabled: false });

    expect(useSettings.getState().revision).toBe(start + 2);
  });

  it("exposes a setter for every preference domain", () => {
    const store = useSettings.getState();

    store.setMotion({ backdrop: "off" });
    store.setNotifications({ limit: 1 });
    store.setNavigation({ bar: "pinned" });
    store.setWindows({ limit: 2 });
    store.setStudio({ expandWindow: true });
    store.setComments({ enabled: false });
    store.setSound({ enabled: false });
    store.setSync({ enabled: false });

    const next = useSettings.getState();
    expect(next.motion.backdrop).toBe("off");
    expect(next.notifications.limit).toBe(1);
    expect(next.navigation.bar).toBe("pinned");
    expect(next.windows.limit).toBe(2);
    expect(next.studio.expandWindow).toBe(true);
    expect(next.comments.enabled).toBe(false);
    expect(next.sound.enabled).toBe(false);
    expect(next.sync.enabled).toBe(false);
  });

  it("sets and clears an experiment flag", () => {
    useSettings.getState().setExperiment("gallery", true);
    expect(useSettings.getState().experiments.gallery).toBe(true);

    useSettings.getState().setExperiment("gallery", false);
    expect(useSettings.getState().experiments.gallery).toBe(false);
  });

  it("resets to the defaults", () => {
    useSettings.getState().setReading({ blur: 99 });
    useSettings.getState().reset();
    expect(useSettings.getState().reading.blur).toBe(defaultSettings.reading.blur);
  });

  it("D5 C2: a selector subscription fires only for the value it selects", () => {
    let blurNotifications = 0;
    const unsubscribe = useSettings.subscribe(
      (state) => state.reading.blur,
      () => {
        blurNotifications += 1;
      },
    );

    useSettings.getState().setSound({ enabled: false });
    useSettings.getState().setWindows({ limit: 3 });
    expect(blurNotifications).toBe(0);

    useSettings.getState().setReading({ blur: 12 });
    expect(blurNotifications).toBe(1);

    unsubscribe();
  });

  it("does not expose a disable* action or field", () => {
    for (const key of Object.keys(useSettings.getState())) {
      expect(key.startsWith("disable")).toBe(false);
    }
  });
});
