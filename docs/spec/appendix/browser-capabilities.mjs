import { execFileSync } from "node:child_process";

const PORT = Number(process.env.WEBDRIVER_PORT ?? 4455);
const BASE = `http://127.0.0.1:${PORT}`;

const call = (method, path, body) => {
  const args = ["-s", "-m", "60", "-X", method, `${BASE}${path}`];
  if (body !== undefined) {
    args.push("-H", "Content-Type: application/json", "-d", JSON.stringify(body));
  }
  const json = JSON.parse(execFileSync("curl", args, { encoding: "utf8" }));
  if (json.value?.error) throw new Error(`${json.value.error}: ${json.value.message}`);
  return json.value;
};

let ready = false;
try {
  ready = call("GET", "/status").ready === true;
} catch {
  ready = false;
}
if (!ready) {
  console.error(`No WebDriver server on port ${PORT}. Start one detached:\n\n  ( safaridriver -p ${PORT} & )\n`);
  process.exit(1);
}

const session = call("POST", "/session", {
  capabilities: { alwaysMatch: { browserName: "safari" } },
});
const id = session.sessionId;

try {
  call("POST", `/session/${id}/url`, { url: "about:blank" });

  const probe = call("POST", `/session/${id}/execute/sync`, {
    script: `
      return {
        userAgent: navigator.userAgent,
        scrollend: "onscrollend" in window,
        scrollendOnElement: "onscrollend" in document.createElement("div"),
        intersectionObserver: typeof IntersectionObserver === "function",
        startViewTransition: typeof document.startViewTransition === "function",
        interpolateSize: CSS.supports("interpolate-size", "allow-keywords"),
        oklch: CSS.supports("color", "oklch(0.5 0.1 200)"),
        colorMixOklab: CSS.supports("color", "color-mix(in oklab, red 50%, transparent)"),
        relativeColor: CSS.supports("color", "oklch(from red l c h)"),
        containerQueries: CSS.supports("container-type", "inline-size"),
        hasSelector: CSS.supports("selector(:has(a))"),
        scrollTimeline: CSS.supports("animation-timeline", "scroll()"),
        pointerEvents: typeof PointerEvent === "function",
        setPointerCapture: "setPointerCapture" in Element.prototype,
        popover: "popover" in HTMLElement.prototype,
        dialog: typeof HTMLDialogElement === "function",
        contentVisibility: CSS.supports("content-visibility", "auto"),
        textWrapBalance: CSS.supports("text-wrap", "balance"),
        fieldSizing: CSS.supports("field-sizing", "content"),
        anchorPositioning: CSS.supports("position-anchor", "--x"),
        transitionBehavior: CSS.supports("transition-behavior", "allow-discrete"),
        viewTransitionName: CSS.supports("view-transition-name", "x"),
      };
    `,
    args: [],
  });

  console.log(`=== Browser capability checks — Safari ${session.capabilities.browserVersion} (WebKit) ===`);
  console.log(`platform ${session.capabilities["safari:platformVersion"]}\n`);

  const rows = [
    ["V-10", "scrollend on window", probe.scrollend],
    ["V-10", "scrollend on an element", probe.scrollendOnElement],
    ["V-10", "IntersectionObserver fallback available", probe.intersectionObserver],
    ["V-11", "document.startViewTransition", probe.startViewTransition],
    ["V-11", "view-transition-name", probe.viewTransitionName],
    ["V-12", "interpolate-size: allow-keywords", probe.interpolateSize],
    ["T2", "oklch() color", probe.oklch],
    ["T5", "color-mix(in oklab, ...)", probe.colorMixOklab],
    ["T5", "relative color syntax", probe.relativeColor],
    ["U1", "container queries", probe.containerQueries],
    ["U1", ":has() selector", probe.hasSelector],
    ["U3", "animation-timeline: scroll()", probe.scrollTimeline],
    ["P2", "PointerEvent", probe.pointerEvents],
    ["P2", "setPointerCapture", probe.setPointerCapture],
    ["P2", "popover attribute", probe.popover],
    ["P2", "HTMLDialogElement", probe.dialog],
    ["P2", "position-anchor", probe.anchorPositioning],
    ["P1", "content-visibility: auto", probe.contentVisibility],
    ["U3", "transition-behavior: allow-discrete", probe.transitionBehavior],
    ["U1", "text-wrap: balance", probe.textWrapBalance],
    ["U2", "field-sizing: content", probe.fieldSizing],
  ];

  for (const [check, feature, supported] of rows) {
    console.log(`  ${check.padEnd(5)} ${feature.padEnd(40)} ${supported ? "yes" : "NO"}`);
  }

  console.log();
  console.log("Consequences");
  console.log(
    `  V-10: ${
      probe.scrollend
        ? "scrollend is available; the IntersectionObserver fallback is still needed for older Safari"
        : "scrollend is ABSENT — P3-01 must take the IntersectionObserver path on this engine"
    }`,
  );
  console.log(
    `  V-11: ${
      probe.startViewTransition
        ? "View Transitions available in WebKit"
        : "View Transitions ABSENT in WebKit — P3-04 and U2-04 must degrade gracefully"
    }`,
  );
  console.log(
    `  V-12: ${
      probe.interpolateSize
        ? "interpolate-size supported; the strip can animate to a keyword size"
        : "interpolate-size ABSENT — U2-03 must degrade to no size animation"
    }`,
  );
  console.log();
  console.log("Note: one engine only. V-11 asks for three engines; Chromium and Gecko are");
  console.log("unavailable here, so the Chrome/Firefox columns remain unmeasured.");
} finally {
  try {
    call("DELETE", `/session/${id}`);
  } catch {
    /* already gone */
  }
}
