# Navigation and site search

This feature is based on `main`. It retains the existing theme variables, specular borders, shadows, icons, routes, settings, window definitions, and content storage. There are no new runtime dependencies or saved-data formats.

## Interaction

The navigation bar shows destinations, search, and the existing window control when space permits. Desktop search keeps the same position and width when scrolling hides destinations. Phones give search a second row; scrolling down substitutes search into the first row after destinations retire. Directional travel suppresses small scroll reversals. Keyboard focus keeps destinations available, and an open search freezes automatic header collapse. An open sidebar reserves its actual width; when the remaining corridor is insufficient, its own search and navigation provide the controls.

`lib/navbarLayout.ts` derives target geometry. React owns the existing menu and expansion state; resize work writes the resulting properties on the header element. CSS owns motion, including interrupted transitions, staggered mobile handoffs, hover labels, menu entry/exit, and search expansion. The implementation does not run a JavaScript animation timeline or scale text. Reduced-motion CSS removes these transitions.

Search uses a native auto popover. Every opening captures its own invoker before focus changes and prepares the entrance coordinates before showing the panel. Only that trigger retires, immediately, avoiding duplicate text during expansion. A reversal from the same trigger continues the current CSS transition; switching triggers starts a fresh entrance at the new trigger. The panel keeps its position while the hidden trigger finishes moving, then measures the current trigger again on dismissal. Viewport changes constrain the panel immediately. The sidebar uses a native modal dialog below 532 pixels and a nonmodal dialog above that boundary, with the original contents and materials. Search opened inside a modal stays inside its focus scope. During a resize, an active search retains its owner until dismissal so the query and focus survive. Closed or retiring surfaces become inert immediately. Escape dismisses search before the underlying menu or legacy popup. Tab leaving the nonmodal search dismisses it. Held shortcuts do not toggle repeatedly.

Opening resets the query and selection. Arrow keys select results, Enter opens or executes, and Command/Ctrl Enter opens a page in another tab. Home and End retain their text-editing behavior. Page navigation starts at the top and transfers focus to the heading; tool commands use the existing window API and transfer focus into the window. Existing theme and preference changes return focus to the opener. Dangerous account/reset commands are not offered.

## Matching and content

`lib/searchUtil.ts` owns parsing, matching, ranking, and the public metadata projection. Plain words combine with AND. Commas, semicolons, and CJK equivalents also separate terms. Quoted phrases stay together; `#tag`, `:author`, and `-term` narrow the search. Matching is case- and accent-insensitive. Exact titles precede prefixes, title words, substrings, keywords, and description matches. Results are grouped without an arbitrary result cap. Empty queries show a small page selection, recent entries, and Settings; the theme catalog appears when searching.

Pages, published blog/album/project/management entries, desktop window tools, existing theme presets/profiles, and selected settings are available. Section names are searchable. Album locations supply a description when none was authored. Search does not index article bodies. Queries stay in the browser.

`GET /api/search` reads the existing bucket keys through `lib/dataLayer/server/searchIndex.ts`. Each section is cached independently for 30 minutes. The response projects only section, slug, plain title/description, tags, authors, and date, excluding unlisted and malformed records. It neither writes an index object nor accesses the rewrite's `v11/` namespace. Partial failures are uncached and retain available sections. Complete failures return 503.

The browser fetches on demand and retains successful summaries for five minutes. Closing aborts a pending read; a twelve-second timeout and Retry handle unavailable content. Local pages and commands remain usable. A resize or virtual-keyboard change bounds the sheet to the visual viewport. Its measured content height animates natively, avoiding empty space for short result lists.

## Verification

Use the project's supported Node version (verified with Node 24), then run:

```sh
npm run test:navigation
npx tsc --noEmit --incremental false
npm run build
```

The focused tests cover grammar, exclusions, ranking, Unicode, metadata projection, unlisted/malformed records, album locations, 9,124 geometry combinations across widths 280–2560, and identical desktop search geometry before/after collapse.

For repeatable motion checks, start a local production server, then run:

```sh
NAVIGATION_TEST_URL=http://127.0.0.1:3000 npm run test:navigation:browser
```

The Playwright development dependency launches a fresh headless browser with a temporary profile. It uses installed Chrome on macOS or Playwright Chromium elsewhere (`npx playwright install chromium` if needed). `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can select another Chromium executable. It never attaches to a personal browser or loads its profile. `NAVIGATION_TEST_OUTPUT` changes the default `/tmp/zimo-navigation-motion` artifact directory.

The browser script samples geometry, opacity, and native CSS transitions on every animation frame. Selected scenarios also save the compositor's rendered frames. It asserts stationary desktop search during scroll; correct per-invoker entrance keyframes; same-trigger reversal continuity; direct switching and immediate reopening from a different trigger; no delayed correction when opening during menu entry; phone destination/search separation; bounded geometry during resize and short viewports; focus and query retention through modal boundaries; keyboard focus restoration; reduced motion; and 4× CPU throttling. Widths: 320, 390, 531, 532, 639, 640, 767, 768, 1024, 1135, 1136, 1280, 1440.

Additional manual review covered real content navigation, tool focus, light/dark themes, utility-page clearance, and Safari desktop search. These checks do not substitute for testing a real mobile virtual keyboard.

The inherited lockfile uses Next.js 16.4.0, which emits a security upgrade advisory. Production compilation, type checking, route generation, and the documented immediate-retry build succeed. The only dependency addition is Playwright for repeatable browser regression; runtime dependencies are unchanged. An inherited Sass deprecation and the legacy account route's caught static-generation diagnostic remain outside the navigation change.
