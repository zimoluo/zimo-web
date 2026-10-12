export type HeaderRect = { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
export type HeaderLayout = {
  readonly sidebar: "closed" | "nonmodal" | "modal";
  readonly mode: "inline" | "stacked" | "substituted" | "quiet";
  readonly span: number;
  readonly height: number;
  readonly visible: boolean;
  readonly nav: { readonly anchor: number; readonly alignment: 0 | -50; readonly rect: HeaderRect; readonly visible: boolean; readonly exit: "up" | "left"; readonly labels: boolean };
  readonly command: HeaderRect & { readonly visible: boolean; readonly detail: boolean; readonly labelLimit: number };
  readonly windows: HeaderRect & { readonly visible: boolean };
  readonly sidebarBoundary: number;
};
export type HeaderState = { readonly width: number; readonly menu: boolean; readonly expanded: boolean; readonly strip: boolean; readonly destinations: number; readonly command: number };

export function layoutHeader(state: HeaderState): HeaderLayout {
  const phone = state.width < 640;
  const padding = phone ? 10 : 16;
  const size = phone ? 48 : 52;
  const modal = state.menu && state.width < 532;
  const span = Math.max(0, state.width - (state.menu && !modal ? 396 : 0));
  const compact = span < 780;
  const suppressed = state.menu && !modal && state.width < 794;
  const visible = !modal;
  const windowsVisible = visible && state.width >= 768 && span >= 480;
  const windowX = Math.max(padding, span - 136);
  const labels = span >= (phone ? 450 : windowsVisible ? 536 : 520);
  const centered = compact || state.width < 768;
  const anchor = centered ? span / 2 - (windowsVisible ? 34 : 0) : 84;
  const alignment = centered ? -50 : 0;
  const navVisible = visible && state.expanded && !suppressed;
  const secondRow = compact && state.expanded && !suppressed;
  const sidebarBoundary = state.menu && !modal ? state.width - 472 : state.width - padding;
  let x: number;
  let y = 10;
  let width: number;
  if (compact) {
    x = secondRow ? padding : padding + size + (phone ? 12 : 16);
    y = secondRow ? (phone ? 68 : 72) : 10;
    const right = state.menu && !modal ? Math.min(span - padding, state.width - 512, !secondRow && windowsVisible ? windowX - 16 : Infinity) : secondRow ? state.width - padding : windowsVisible ? windowX - 16 : state.width - x;
    width = Math.max(0, right - x);
  } else {
    const right = windowX - 16;
    width = Math.max(0, Math.min(state.command, right - (84 + state.destinations + (labels ? 72 : 0) + 16)));
    x = right - width;
  }
  const commandVisible = visible && state.strip && !(state.menu && !modal && span < 340);
  return {
    sidebar: state.menu ? modal ? "modal" : "nonmodal" : "closed",
    mode: !commandVisible ? "quiet" : compact ? secondRow ? "stacked" : "substituted" : "inline",
    span,
    height: secondRow && state.strip ? (phone ? 120 : 124) : (phone ? 68 : 72),
    visible,
    nav: { anchor, alignment, rect: { x: anchor + alignment / 100 * state.destinations, y: 10, width: state.destinations, height: size }, visible: navVisible, exit: centered ? "up" : "left", labels },
    command: { x, y, width, height: size, visible: commandVisible, detail: span >= 900, labelLimit: compact ? Math.max(0, width - 76) : span >= 900 ? 352 : 192 },
    windows: { x: windowX, y: 10, width: 52, height: 52, visible: windowsVisible },
    sidebarBoundary,
  };
}

export type HeaderMotion = {
  readonly command: readonly (HeaderRect & { readonly offset: number })[];
  readonly holdWindows: boolean;
  readonly navEnterDelay: number;
  readonly accountEnterDelay: number;
  readonly windowEnterDelay: number;
  readonly headerEnterDelay: number;
  readonly navFade?: boolean;
};
export type HeaderPose = { readonly command: HeaderRect; readonly nav: HeaderRect; readonly headerVisible: boolean; readonly navVisible: boolean; readonly windowsVisible: boolean; readonly sidebarBoundary: number };
export function planHeaderMotion(pose: HeaderPose, to: HeaderLayout): HeaderMotion {
  const { command: from, nav: fromNav, navVisible: navWasVisible, sidebarBoundary: boundary } = pose;
  const overlapsNav = from.x < to.nav.rect.x + to.nav.rect.width + 16 && from.x + from.width > to.nav.rect.x && from.y < to.nav.rect.y + to.nav.rect.height;
  const defaults = { headerEnterDelay: !pose.headerVisible && to.visible ? 160 : 0, accountEnterDelay: to.sidebar === "nonmodal" ? 200 : 0, windowEnterDelay: !pose.windowsVisible && to.windows.visible ? 160 : 0 };
  const end = to.command;
  const rowChanges = Math.abs(from.y - end.y) > 1;
  const direct = [{ ...from, offset: 0 }, { ...end, offset: 1 }];
  if (!rowChanges || !end.visible) return { command: direct, holdWindows: false, navEnterDelay: !navWasVisible && to.nav.visible && overlapsNav ? 180 : 0, ...defaults };
  if (!navWasVisible || !to.nav.visible) {
    return { command: to.nav.visible ? direct : [{ ...from, offset: 0 }, { ...from, offset: .27 }, { ...end, offset: 1 }], holdWindows: false, navEnterDelay: to.nav.visible ? 180 : 0, ...defaults };
  }
  const bridgeX = Math.max(fromNav.x + fromNav.width, to.nav.rect.x + to.nav.rect.width) + 16;
  const bridgeWidth = Math.min(from.width, end.width, Math.min(boundary, to.sidebarBoundary) - bridgeX);
  if (bridgeWidth < 76) {
    return end.y > from.y
      ? { command: [{ ...from, offset: 0 }, { ...from, y: end.y, offset: .35 }, { ...end, offset: 1 }], holdWindows: true, navEnterDelay: 0, ...defaults, accountEnterDelay: 240 }
      : { command: [{ ...from, offset: 0 }, { ...from, offset: .27 }, { ...from, y: end.y, offset: .57 }, { ...end, offset: 1 }], holdWindows: false, navEnterDelay: 0, ...defaults, navFade: true };
  }
  const bridge = { x: bridgeX, y: from.y, width: bridgeWidth, height: end.height };
  return {
    command: [{ ...from, offset: 0 }, { ...bridge, offset: .28 }, { ...bridge, y: end.y, offset: .64 }, { ...end, offset: 1 }],
    holdWindows: end.y > from.y,
    navEnterDelay: 0,
    ...defaults,
  };
}
