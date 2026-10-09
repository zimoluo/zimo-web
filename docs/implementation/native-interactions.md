# Native interaction synchronization

Window frames synchronize keyboard focus with their native DOM lifetime and restore a connected opener when removed. Drag and resize hooks paint DOM geometry during Pointer Events and write the store only on release. The window layer restores validated saved geometry after the browser viewport and current settings are available. Navigation measures its actual DOM height for the window inset and subscribes to navigation visibility preferences.

Overlay dialogs enter the browser top layer with showModal. Removal of their DOM nodes removes them from that layer. Effects do not close a dialog during cleanup: React Strict Mode replay would queue a close event that dismisses the reopened overlay. A removed dialog restores its connected opener. Mobile navigation synchronizes a native dialog with menu visibility; desktop navigation listens for outside pointer events and Escape.

Readers synchronize with entry endpoints using abortable requests. The shared tree synchronizes decorations with the server and stores viewed identities in the workspace. Calculator shortcuts listen to the keyboard only while their window is active. Optional swipes subscribe to Pointer Events when gestures are enabled.

Media viewers use native scroll snapping and update the current slide after scrollend or visibility settling. The only imperative scroll synchronization restores an index or switches back from a grid. Document images use their authored, measured dimensions; galleries share one lazy native viewer. An image without valid dimensions remains an authored source link rather than reserving fabricated geometry.

## Context commands

U2's command palette is a native auto popover, opened by CmdK/CtrlK across routes and windows. It keeps keyboard focus in an accessible combobox, exposes the selected command with aria-activedescendant, and supports arrow navigation/Enter. Destination, theme, profile, widget, settings and entry commands share the existing query parser. Entry indexes load once per palette lifetime with abortable requests; failures leave other commands usable.

The strip shows the highest-priority registered contribution; equal priorities keep registration order. Optional TTL timers retract transient contributions without polling. Wide-screen short neutral notifications without actions use the strip and retain the notification engine's normal auto-dismiss timer and queue limits. Warnings, errors, longer messages, action notifications, narrow layouts and a disabled strip keep normal notification cards.

Navbar auto collapse uses CSS animation-timeline: scroll(root) over the first 100 pixels. Pinned and hidden preferences use html[data-nav]; browsers without scroll timelines keep automatic navigation visible. Navigation has no JavaScript scroll listeners. Article reading progress uses a named view timeline and a CSS scale transform; it never publishes scroll positions to React. Native popover and resize media-query effects synchronize browser state with selectors. Reduced-motion preferences suppress morph view transitions and size changes.

## Reproducing browser checks

Install the locked development dependencies with npm ci, then install Chromium with npx playwright install chromium. Seed isolated development content with npm run content:seed and start the site with ZIMO_WEB_LOCAL_STORAGE_ONLY=true. The browser scripts accept the preview URL as their first argument; their default is http://localhost:3481. Run tools/perf/browser-smoke.mjs for windows, nested overlays, notebook persistence and the mobile menu; navigation-smoke.mjs for command keyboard behavior; studio-smoke.mjs for profiles, picker, layers, scenes and mobile Studio; accessibility-smoke.mjs for axe WCAG A/AA checks across eleven routes and interactive states. Reports and screenshots go under work/*-smoke. These are fixtures, not production data verification.

PLAYWRIGHT_MODULE can point to an existing installation, CHROME_EXECUTABLE can point to an existing browser, and SMOKE_OUTPUT selects a different evidence directory. The dedicated browser workflow installs its own locked dependencies and Chromium, uses isolated local fixtures, starts a production build, and saves all browser evidence. Axe's incomplete findings remain in the report for manual review; passing the automated checks does not replace keyboard and visual inspection.

Route announcements synchronize a polite live region after discrete App Router navigation. A separate theme selector announces only active theme and effective scheme changes; profile draft edits and scroll position never update either live region. Image paging already announces the settled index through its local polite status. These DOM effects synchronize assistive technology with browser navigation and selection.

Embedded article cards synchronize with the public summary index and abort requests when their authored reference unmounts. Missing or unavailable summaries preserve canonical readable links; invalid slugs stay visible and never issue a request.

## Performance evidence

interaction-performance-smoke.mjs calibrates its React root instrumentation using a discrete keyboard movement, then samples root.current alternation once per animation frame. At fourfold CPU throttling it checks that a three-second held window drag and navbar scrolling produce no sampled root transitions or localStorage writes, and that release persists geometry once. It also reports Chrome layout/style/script/task metrics and long tasks. Frame sampling can miss paired commits within one frame, so this bounded regression gate is not a replacement for React profiling-build commit durations or the nine historical P1 scenario baselines.

size-report.mjs measures scripts fetched during initial hydration of Home, a fixture article, Album and Studio. The dedicated production workflow records raw bytes and independently recompressed gzip/Brotli sizes without inventing a before/after reduction or an arbitrary JavaScript budget. The generated theme CSS budget remains enforced by themes:check. Reports identify their environment and use current fixture routes; real content and pre-migration payload comparisons remain separate measurements.

Strip-routed confirmations keep a visually hidden announcement in the notification live region, so routing the visible content into the context strip preserves assistive feedback and the original auto-dismiss behavior.

The command palette portals into the focused native modal when opened there, preserving interaction under the browser inert rules. Escape dismisses the palette first and restores focus inside the entry modal; closing the parent modal also clears the palette.
