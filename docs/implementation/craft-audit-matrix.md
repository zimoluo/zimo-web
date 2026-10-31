# Craft audit matrix

Started October 31, 2026 for the renewed whole-site audit. This is a coverage inventory, not a claim that the listed surfaces pass. The earlier [fidelity log](site-fidelity.md) records verified work and open visual gaps.

## Acceptance contract

Read the original [design principles](https://www.zimoluo.me/design) and the owning v10 source before changing a carried surface. Compare the intended composition and interaction, not just its screenshot. Check default/hover/focus/pressed/disabled, opening/closing/reversal/interruption, long text and empty/error/loading states, keyboard and pointer input, phone/desktop/contained windows, normal/reduced motion, and applicable appearances. Inspect concentric corners from actual padding, quiet reading outlines versus specular controls, exact rim masks, shadow geometry, optical alignment, and color under translucency. Record the evidence and any deliberate improvement. A passing accessibility or pixel test alone cannot close the craft review.

## This pass

- Implemented and stress-tested shared channel ownership; the channel conversion preserves the published paint and master-hue response of all 59 presets. A separate valid-color gamut repair deliberately changes small chroma rounding values. This is not final artistic regrouping of each preset.
- Material page/preview/thumbnail paths now include fixed layers and opacity. The page fallback follows v10’s browser/site color, rather than the interface panel. Preview labels and shared shadow tokens rebind at the local theme boundary. Browser evidence is recorded separately in the fidelity log.
- Compared the original backdrop source inventory (78 files) and 37 CSS keyframe programs. Geometry differences were narrowed to Eep's equivalent `from`/`to` filter form, Home's host-relative translation, Photos' explicit replacement for Tailwind transform variables, and Projects' split transform/rotate composition. These comparisons are not a full rendered motion-phase review.
- Removed the palette calibration dependency on editable presets. Original SVG/shader anchors are now stable data, so source-level channel edits are not canceled during asset generation.
- Midnight's reduced-motion click circle now uses local bounds, local contained input, owned resize observation, and the authored 600ms timing scaled by scene speed. Viewport input retains document-wide clicking.
- Bucket audit found complete canonical frontmatter, matching sidecars, and no repeated media-catalog URLs. Canonical reads and new migration output no longer require sidecar authority. Per-occurrence image meaning is preserved.
- Design and Settings now share the original-style theme chooser. The full-width four-color/two-material display and fuller material explanations return to Design. Its backdrop reveal preserves the original scroll equation with an owned DOM paint instead of scroll-driven React state. Touch labels remain visible.

- Window ownership review repairs stale pointer commits, maximize/restore, focus return, eight resize hit areas, original Shift locking and Calculator dimensions/material ownership. Native normal-motion Chrome usage and executable regressions cover these transitions; the whole widget/browser matrix stays open. The [window state map](window-interaction-state-map.md) records the precise boundaries.

## Complete UI source inventory

The predecessor column is an initial basename match, not proof of equivalence. A missing match does not establish that no v10 counterpart exists. Icons are excluded from this table, but their hosts and the existing icon geometry tests remain part of review. Backdrop modules have their own inventory below.

| v11 surface | Candidate v10 predecessor | Review status |
| --- | --- | --- |
| [src/app/about/page.tsx](../../src/app/about/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/album/[slug]/page.tsx](../../src/app/album/[slug]/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/album/page.tsx](../../src/app/album/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/album/tags/[tag]/page.tsx](../../src/app/album/tags/[tag]/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/blog/[slug]/layout.tsx](../../src/app/blog/[slug]/layout.tsx) | `app/blog/[slug]/layout.tsx`, `app/blog/tags/[tag]/layout.tsx` | Open: source, interaction and rendered comparison |
| [src/app/blog/[slug]/not-found.tsx](../../src/app/blog/[slug]/not-found.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/app/blog/[slug]/page.tsx](../../src/app/blog/[slug]/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/blog/page.tsx](../../src/app/blog/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/blog/tags/[tag]/layout.tsx](../../src/app/blog/tags/[tag]/layout.tsx) | `app/blog/[slug]/layout.tsx`, `app/blog/tags/[tag]/layout.tsx` | Open: source, interaction and rendered comparison |
| [src/app/blog/tags/[tag]/not-found.tsx](../../src/app/blog/tags/[tag]/not-found.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/app/blog/tags/[tag]/page.tsx](../../src/app/blog/tags/[tag]/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/christmas-tree/page.tsx](../../src/app/christmas-tree/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/design/ColorBlock.tsx](../../src/app/design/ColorBlock.tsx) | `app/design/ColorBlock.tsx` | Partial: original label reveal retained; touch labels visible; light/dark desktop/phone captures |
| [src/app/design/DesignBackdropCurtain.tsx](../../src/app/design/DesignBackdropCurtain.tsx) | `app/design/DesignBackdropCurtain.tsx` | Partial: original fade equation retained; resize/scroll/frame ownership repaired; zero observed continuous React commits |
| [src/app/design/DesignThemes.tsx](../../src/app/design/DesignThemes.tsx) | `components/mainPage/menu/settings/SettingsThemePicker.tsx` | Partial: shared Settings chooser replaces divergent mark tiles; keyboard wrap/selection and phone bounds pass |
| [src/app/design/DesignWidgetPreview.tsx](../../src/app/design/DesignWidgetPreview.tsx) | `app/design/DesignWidgetPreview.tsx` | Open: source, interaction and rendered comparison |
| [src/app/design/page.tsx](../../src/app/design/page.tsx) | `app/design/page.tsx` | Partial: palette, material principles and reveal restored; original favicon gallery remains open |
| [src/app/design/Palette.tsx](../../src/app/design/Palette.tsx) | `app/design/PaletteMain.tsx`, `app/design/PaletteOther.tsx` | Partial: authored six-panel layout mapped to v11 roles/materials; light/dark phone and desktop verified |
| [src/app/design/palette.module.css](../../src/app/design/palette.module.css) | `app/design/palette.module.css` | Partial: original responsive palette geometry retained; touch/reduced-motion label behavior checked |
| [src/app/design/theme-maker/layout.tsx](../../src/app/design/theme-maker/layout.tsx) | `app/blog/[slug]/layout.tsx`, `app/blog/tags/[tag]/layout.tsx` | Open: source, interaction and rendered comparison |
| [src/app/design/theme-maker/page.tsx](../../src/app/design/theme-maker/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/error.tsx](../../src/app/error.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/app/global-error.tsx](../../src/app/global-error.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/app/layout.tsx](../../src/app/layout.tsx) | `app/blog/[slug]/layout.tsx`, `app/blog/tags/[tag]/layout.tsx` | Open: source, interaction and rendered comparison |
| [src/app/loading.tsx](../../src/app/loading.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/app/management/[slug]/layout.tsx](../../src/app/management/[slug]/layout.tsx) | `app/blog/[slug]/layout.tsx`, `app/blog/tags/[tag]/layout.tsx` | Open: source, interaction and rendered comparison |
| [src/app/management/[slug]/not-found.tsx](../../src/app/management/[slug]/not-found.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/app/management/[slug]/page.tsx](../../src/app/management/[slug]/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/management/page.tsx](../../src/app/management/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/management/tags/[tag]/page.tsx](../../src/app/management/tags/[tag]/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/not-found.tsx](../../src/app/not-found.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/app/notebook/layout.tsx](../../src/app/notebook/layout.tsx) | `app/blog/[slug]/layout.tsx`, `app/blog/tags/[tag]/layout.tsx` | Open: source, interaction and rendered comparison |
| [src/app/notebook/page.tsx](../../src/app/notebook/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/page.tsx](../../src/app/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/photos/[slug]/layout.tsx](../../src/app/photos/[slug]/layout.tsx) | `app/blog/[slug]/layout.tsx`, `app/blog/tags/[tag]/layout.tsx` | Open: source, interaction and rendered comparison |
| [src/app/photos/[slug]/not-found.tsx](../../src/app/photos/[slug]/not-found.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/app/photos/[slug]/page.tsx](../../src/app/photos/[slug]/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/photos/page.tsx](../../src/app/photos/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/projects/[slug]/layout.tsx](../../src/app/projects/[slug]/layout.tsx) | `app/blog/[slug]/layout.tsx`, `app/blog/tags/[tag]/layout.tsx` | Open: source, interaction and rendered comparison |
| [src/app/projects/[slug]/not-found.tsx](../../src/app/projects/[slug]/not-found.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/app/projects/[slug]/page.tsx](../../src/app/projects/[slug]/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/projects/page.tsx](../../src/app/projects/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/app/projects/tags/[tag]/page.tsx](../../src/app/projects/tags/[tag]/page.tsx) | `app/about/page.tsx`, `app/blog/[slug]/page.tsx` | Open: source, interaction and rendered comparison |
| [src/features/about/ui/AboutContent.tsx](../../src/features/about/ui/AboutContent.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/about/ui/AboutZimoText.tsx](../../src/features/about/ui/AboutZimoText.tsx) | `app/about/AboutZimoText.tsx` | Open: source, interaction and rendered comparison |
| [src/features/about/ui/zimo-text.module.css](../../src/features/about/ui/zimo-text.module.css) | `app/about/zimo-text.module.css` | Open: source, interaction and rendered comparison |
| [src/features/account/ui/GoogleOAuthProvider.tsx](../../src/features/account/ui/GoogleOAuthProvider.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/account/ui/UserStateIcon.tsx](../../src/features/account/ui/UserStateIcon.tsx) | `components/assets/user/UserStateIcon.tsx` | Open: source, interaction and rendered comparison |
| [src/features/backdrop/host/BackdropStack.tsx](../../src/features/backdrop/host/BackdropStack.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/backdrop/host/PageTitle.tsx](../../src/features/backdrop/host/PageTitle.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/backdrop/host/PaletteImage.tsx](../../src/features/backdrop/host/PaletteImage.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/backdrop/host/RuntimeFrame.tsx](../../src/features/backdrop/host/RuntimeFrame.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/backdrop/host/SceneCanvas.tsx](../../src/features/backdrop/host/SceneCanvas.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/backdrop/host/SceneRuntimeContext.tsx](../../src/features/backdrop/host/SceneRuntimeContext.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/backdrop/host/backdrop.module.css](../../src/features/backdrop/host/backdrop.module.css) | `components/assets/displayFavicon/backdrop.module.css` | Open: source, interaction and rendered comparison |
| [src/features/backdrop/host/page-title.module.css](../../src/features/backdrop/host/page-title.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/backdrop/mark/MarkScene.tsx](../../src/features/backdrop/mark/MarkScene.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/backdrop/mark/mark-scene.module.css](../../src/features/backdrop/mark/mark-scene.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/calculator/Calculator.tsx](../../src/features/calculator/Calculator.tsx) | New surface / manual mapping required | Partial: focus-scoped keyboard input and scientific resizing restored; native typing/search/resize checked; finer widget animation review open |
| [src/features/calculator/calculator.module.css](../../src/features/calculator/calculator.module.css) | `components/window/widget/calculator.module.css` | Open: source, interaction and rendered comparison |
| [src/features/christmas-tree/ui/TreeBoard.tsx](../../src/features/christmas-tree/ui/TreeBoard.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/christmas-tree/ui/TreeOverlays.tsx](../../src/features/christmas-tree/ui/TreeOverlays.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/christmas-tree/ui/tree.module.css](../../src/features/christmas-tree/ui/tree.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/comments/ui/Comments.tsx](../../src/features/comments/ui/Comments.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/comments/ui/Composer.tsx](../../src/features/comments/ui/Composer.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/comments/ui/IdentityAvatar.tsx](../../src/features/comments/ui/IdentityAvatar.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/comments/ui/ReactionButton.tsx](../../src/features/comments/ui/ReactionButton.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/comments/ui/comments.module.css](../../src/features/comments/ui/comments.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/document/components/DirectiveCard.tsx](../../src/features/document/components/DirectiveCard.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/document/components/Disclosure.tsx](../../src/features/document/components/Disclosure.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/document/components/DisclosureList.tsx](../../src/features/document/components/DisclosureList.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/document/components/DocumentMusicPlayer.tsx](../../src/features/document/components/DocumentMusicPlayer.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/document/components/Glyph.tsx](../../src/features/document/components/Glyph.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/document/components/InlineMarks.tsx](../../src/features/document/components/InlineMarks.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/document/components/ThemePicker.tsx](../../src/features/document/components/ThemePicker.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/entries/ui/ArticleActions.tsx](../../src/features/entries/ui/ArticleActions.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/entries/ui/ArticleView.tsx](../../src/features/entries/ui/ArticleView.tsx) | New surface / manual mapping required | Partial: embedded reader no longer doubles the host material/shadow; broader reading/comment review open |
| [src/features/entries/ui/AuthorLine.tsx](../../src/features/entries/ui/AuthorLine.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/entries/ui/EntryList.tsx](../../src/features/entries/ui/EntryList.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/entries/ui/Masonry.tsx](../../src/features/entries/ui/Masonry.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/entries/ui/entries.module.css](../../src/features/entries/ui/entries.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/home/ui/FeaturedCard.tsx](../../src/features/home/ui/FeaturedCard.tsx) | `components/widgets/FeaturedCard.tsx` | Open: source, interaction and rendered comparison |
| [src/features/home/ui/FeaturedCardFetcher.tsx](../../src/features/home/ui/FeaturedCardFetcher.tsx) | `components/widgets/FeaturedCardFetcher.tsx` | Open: source, interaction and rendered comparison |
| [src/features/home/ui/HomeCommentSection.tsx](../../src/features/home/ui/HomeCommentSection.tsx) | `app/HomeCommentSection.tsx` | Open: source, interaction and rendered comparison |
| [src/features/home/ui/HomeContent.tsx](../../src/features/home/ui/HomeContent.tsx) | `app/HomeContent.tsx` | Open: source, interaction and rendered comparison |
| [src/features/media/AudioPlayer.tsx](../../src/features/media/AudioPlayer.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/media/ImageViewer.tsx](../../src/features/media/ImageViewer.tsx) | `components/widgets/ImageViewer.tsx` | Open: source, interaction and rendered comparison |
| [src/features/media/Lightbox.tsx](../../src/features/media/Lightbox.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/media/audio-player.module.css](../../src/features/media/audio-player.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/media/media.module.css](../../src/features/media/media.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/navigation/CommandPalette.tsx](../../src/features/navigation/CommandPalette.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/navigation/ContextStrip.tsx](../../src/features/navigation/ContextStrip.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/navigation/LiveAnnouncements.tsx](../../src/features/navigation/LiveAnnouncements.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/navigation/NavigationHost.tsx](../../src/features/navigation/NavigationHost.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/navigation/contributions.tsx](../../src/features/navigation/contributions.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/navigation/icons.tsx](../../src/features/navigation/icons.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/navigation/strip.module.css](../../src/features/navigation/strip.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/notebook/ui/NotebookEditor.tsx](../../src/features/notebook/ui/NotebookEditor.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/notebook/ui/notebook.module.css](../../src/features/notebook/ui/notebook.module.css) | `components/window/widget/notebook.module.css` | Open: source, interaction and rendered comparison |
| [src/features/notifications/ui/NotificationCard.tsx](../../src/features/notifications/ui/NotificationCard.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/notifications/ui/NotificationHost.tsx](../../src/features/notifications/ui/NotificationHost.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/notifications/ui/NotificationIconView.tsx](../../src/features/notifications/ui/NotificationIconView.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/notifications/ui/NotificationLayer.tsx](../../src/features/notifications/ui/NotificationLayer.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/notifications/ui/notifications.module.css](../../src/features/notifications/ui/notifications.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/overlays/identity.tsx](../../src/features/overlays/identity.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/overlays/ui/OverlayDialog.tsx](../../src/features/overlays/ui/OverlayDialog.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/overlays/ui/OverlayLayer.tsx](../../src/features/overlays/ui/OverlayLayer.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/overlays/ui/overlays.module.css](../../src/features/overlays/ui/overlays.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/settings/ui/SettingsControls.tsx](../../src/features/settings/ui/SettingsControls.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/settings/ui/SettingsHost.tsx](../../src/features/settings/ui/SettingsHost.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/settings/ui/ThemeChoices.tsx](../../src/features/settings/ui/ThemeChoices.tsx) | `components/mainPage/menu/settings/SettingsThemePicker.tsx`, `ThemePickerButton.tsx` | Partial: shared original-style chooser; caption and selection share the hydration snapshot; broader appearance/interaction review open |
| [src/features/settings/ui/SettingsPanel.tsx](../../src/features/settings/ui/SettingsPanel.tsx) | `components/mainPage/menu/settings/SettingsThemePicker.tsx` | Partial: picker shared with Design without changing selection scope; broader Settings craft review remains open |
| [src/features/settings/ui/settings.module.css](../../src/features/settings/ui/settings.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/BackgroundAnimation.tsx](../../src/features/shell/ui/BackgroundAnimation.tsx) | `components/mainPage/BackgroundAnimation.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/BackgroundImage.tsx](../../src/features/shell/ui/BackgroundImage.tsx) | `components/mainPage/BackgroundImage.tsx` | October 31: focused channel/material/browser checks passed; full interaction-state audit remains open |
| [src/features/shell/ui/Footer.tsx](../../src/features/shell/ui/Footer.tsx) | `components/mainPage/Footer.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/HeaderText.tsx](../../src/features/shell/ui/HeaderText.tsx) | `components/mainPage/HeaderText.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/MainPageElements.tsx](../../src/features/shell/ui/MainPageElements.tsx) | `components/mainPage/MainPageElements.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/MainPageFrame.tsx](../../src/features/shell/ui/MainPageFrame.tsx) | `components/mainPage/MainPageFrame.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/NavbarContent.tsx](../../src/features/shell/ui/NavbarContent.tsx) | `components/mainPage/NavbarContent.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/NavbarExpandWrapper.tsx](../../src/features/shell/ui/NavbarExpandWrapper.tsx) | `components/mainPage/NavbarExpandWrapper.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/NavbarGlow.tsx](../../src/features/shell/ui/NavbarGlow.tsx) | `components/mainPage/NavbarGlow.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/NavbarWindowButton.tsx](../../src/features/shell/ui/NavbarWindowButton.tsx) | `components/mainPage/NavbarWindowButton.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/NavbarWrapper.tsx](../../src/features/shell/ui/NavbarWrapper.tsx) | `components/mainPage/NavbarWrapper.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/SocialMediaButtons.tsx](../../src/features/shell/ui/SocialMediaButtons.tsx) | `components/mainPage/SocialMediaButtons.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/footer.module.css](../../src/features/shell/ui/footer.module.css) | `components/mainPage/footer.module.css` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/header-text.module.css](../../src/features/shell/ui/header-text.module.css) | `components/mainPage/header-text.module.css` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/menu/MenuEntriesLayout.tsx](../../src/features/shell/ui/menu/MenuEntriesLayout.tsx) | `components/mainPage/menu/MenuEntriesLayout.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/menu/MenuEntriesNavigation.tsx](../../src/features/shell/ui/menu/MenuEntriesNavigation.tsx) | `components/mainPage/menu/MenuEntriesNavigation.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/menu/MenuEntriesSettings.tsx](../../src/features/shell/ui/menu/MenuEntriesSettings.tsx) | `components/mainPage/menu/MenuEntriesSettings.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/menu/MenuEntriesUser.tsx](../../src/features/shell/ui/menu/MenuEntriesUser.tsx) | `components/mainPage/menu/MenuEntriesUser.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/menu/MenuEntriesUtility.tsx](../../src/features/shell/ui/menu/MenuEntriesUtility.tsx) | `components/mainPage/menu/MenuEntriesUtility.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/menu/MenuNavigationEntryGlow.tsx](../../src/features/shell/ui/menu/MenuNavigationEntryGlow.tsx) | `components/mainPage/menu/MenuNavigationEntryGlow.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/menu/MenuNavigationEntryText.tsx](../../src/features/shell/ui/menu/MenuNavigationEntryText.tsx) | `components/mainPage/menu/MenuNavigationEntryText.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/menu/MenuSlideWrapper.tsx](../../src/features/shell/ui/menu/MenuSlideWrapper.tsx) | `components/mainPage/menu/MenuSlideWrapper.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/menu/menu.module.css](../../src/features/shell/ui/menu/menu.module.css) | `components/mainPage/menu/menu.module.css` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/navbar.module.css](../../src/features/shell/ui/navbar.module.css) | `components/mainPage/navbar.module.css` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/textBox/SectionTextTitle.tsx](../../src/features/shell/ui/textBox/SectionTextTitle.tsx) | `components/mainPage/textBox/SectionTextTitle.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/textBox/TextBox.tsx](../../src/features/shell/ui/textBox/TextBox.tsx) | `components/mainPage/textBox/TextBox.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/textBox/TextBoxMainPageLocator.tsx](../../src/features/shell/ui/textBox/TextBoxMainPageLocator.tsx) | `components/mainPage/textBox/TextBoxMainPageLocator.tsx` | Open: source, interaction and rendered comparison |
| [src/features/shell/ui/window-button.module.css](../../src/features/shell/ui/window-button.module.css) | `components/mainPage/window-button.module.css` | Open: source, interaction and rendered comparison |
| [src/features/signal/SignalGenerator.tsx](../../src/features/signal/SignalGenerator.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/signal/signal.module.css](../../src/features/signal/signal.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/mark/Mark.tsx](../../src/features/theme/mark/Mark.tsx) | New surface / manual mapping required | October 31: focused channel/material/browser checks passed; full interaction-state audit remains open |
| [src/features/theme/runtime/SchemeHost.tsx](../../src/features/theme/runtime/SchemeHost.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/runtime/ThemeHost.tsx](../../src/features/theme/runtime/ThemeHost.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/runtime/ThemeMark.tsx](../../src/features/theme/runtime/ThemeMark.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/runtime/ThemeRuntime.tsx](../../src/features/theme/runtime/ThemeRuntime.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/studio/color/ColorPicker.tsx](../../src/features/theme/studio/color/ColorPicker.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/studio/color/ColorSwatch.tsx](../../src/features/theme/studio/color/ColorSwatch.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/studio/color/StudioPickerHost.tsx](../../src/features/theme/studio/color/StudioPickerHost.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/studio/ui/ChannelEditor.tsx](../../src/features/theme/studio/ui/ChannelEditor.tsx) | New surface / manual mapping required | October 31: focused channel/material/browser checks passed; full interaction-state audit remains open |
| [src/features/theme/studio/ui/LayerShelf.tsx](../../src/features/theme/studio/ui/LayerShelf.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/studio/ui/ProfileList.tsx](../../src/features/theme/studio/ui/ProfileList.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/studio/ui/RampStrip.tsx](../../src/features/theme/studio/ui/RampStrip.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/studio/ui/SchemeEditor.tsx](../../src/features/theme/studio/ui/SchemeEditor.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/theme/studio/ui/StudioRoot.tsx](../../src/features/theme/studio/ui/StudioRoot.tsx) | New surface / manual mapping required | October 31: focused channel/material/browser checks passed; full interaction-state audit remains open |
| [src/features/theme/studio/ui/Workbench.tsx](../../src/features/theme/studio/ui/Workbench.tsx) | New surface / manual mapping required | October 31: focused channel/material/browser checks passed; full interaction-state audit remains open |
| [src/features/theme/studio/ui/studio.module.css](../../src/features/theme/studio/ui/studio.module.css) | New surface / manual mapping required | October 31: focused channel/material/browser checks passed; full interaction-state audit remains open |
| [src/features/windows/ui/Blank.tsx](../../src/features/windows/ui/Blank.tsx) | New surface / manual mapping required | Partial: original content-owned material; all eight resize hit areas checked in Chrome; wider browser/animation review open |
| [src/features/windows/ui/EntryReader.tsx](../../src/features/windows/ui/EntryReader.tsx) | New surface / manual mapping required | Partial: owned requests, distinct loading/error/empty states and Retry; late-result regressions covered; broader reading craft open |
| [src/features/windows/ui/IdentityMarkWindow.tsx](../../src/features/windows/ui/IdentityMarkWindow.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/windows/ui/Navigator.tsx](../../src/features/windows/ui/Navigator.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/windows/ui/StickyNote.tsx](../../src/features/windows/ui/StickyNote.tsx) | New surface / manual mapping required | Partial: original 4px perimeter and content paint ownership restored; detailed editing/touch review open |
| [src/features/windows/ui/WebFrame.tsx](../../src/features/windows/ui/WebFrame.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/features/windows/ui/WindowDebugger.tsx](../../src/features/windows/ui/WindowDebugger.tsx) | `components/window/widget/WindowDebugger.tsx` | Open: source, interaction and rendered comparison |
| [src/features/windows/ui/WindowFrame.tsx](../../src/features/windows/ui/WindowFrame.tsx) | New surface / manual mapping required | Partial: gesture handover, maximize/restore, focus return and material ownership repaired; native Chrome scenarios pass; full browser/animation matrix open |
| [src/features/windows/ui/WindowLayer.tsx](../../src/features/windows/ui/WindowLayer.tsx) | New surface / manual mapping required | Partial: held gestures retain ownership during viewport fit; independent navbar-inset fitting remains open |
| [src/features/windows/ui/WindowPicker.tsx](../../src/features/windows/ui/WindowPicker.tsx) | `components/window/WindowPicker.tsx` | Open: source, interaction and rendered comparison |
| [src/features/windows/ui/windows.module.css](../../src/features/windows/ui/windows.module.css) | New surface / manual mapping required | Partial: original 32px default, independent corners and edge hit order restored; broader materials/motion review open |
| [src/features/windows/window-identity.tsx](../../src/features/windows/window-identity.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/ui/NumberInput.tsx](../../src/ui/NumberInput.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/ui/SurfaceRim.tsx](../../src/ui/SurfaceRim.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/ui/Toggle.tsx](../../src/ui/Toggle.tsx) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/ui/controls.module.css](../../src/ui/controls.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |
| [src/ui/utility-page.module.css](../../src/ui/utility-page.module.css) | New surface / manual mapping required | Open: source, interaction and rendered comparison |

## Every backdrop remains an explicit review target

For each scene, inspect its v10 module and SVG/CSS/shader/texture dependencies, then compare full/reduced/still behavior and each advertised color family. Preserve geometry, phase relationships, composition order, alpha masks and source texture detail. Verify channel edits on the actual renderer, not only controls or declared uniforms. Raster filtering and nearest-slot SVG assignment still need bespoke art-direction review.

| Scene | Source | Original source | Remaining verification |
| --- | --- | --- | --- |
| bewitched | [src/features/backdrop/scenes/bewitched](../../src/features/backdrop/scenes/bewitched) | `components/mainPage/backgroundAnimations/bewitched` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| birthday | [src/features/backdrop/scenes/birthday](../../src/features/backdrop/scenes/birthday) | `components/mainPage/backgroundAnimations/birthday` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| birthday19 | [src/features/backdrop/scenes/birthday19](../../src/features/backdrop/scenes/birthday19) | `components/mainPage/backgroundAnimations/birthday19` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| birthday20 | [src/features/backdrop/scenes/birthday20](../../src/features/backdrop/scenes/birthday20) | `components/mainPage/backgroundAnimations/birthday20` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| blog | [src/features/backdrop/scenes/blog](../../src/features/backdrop/scenes/blog) | `components/mainPage/backgroundAnimations/blog` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| bubbles | [src/features/backdrop/scenes/bubbles](../../src/features/backdrop/scenes/bubbles) | `components/mainPage/backgroundAnimations/bubbles` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| celebration | [src/features/backdrop/scenes/celebration](../../src/features/backdrop/scenes/celebration) | `components/mainPage/backgroundAnimations/celebration` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| christmas | [src/features/backdrop/scenes/christmas](../../src/features/backdrop/scenes/christmas) | `components/mainPage/backgroundAnimations/christmas` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| crimson | [src/features/backdrop/scenes/crimson](../../src/features/backdrop/scenes/crimson) | `components/mainPage/backgroundAnimations/crimson` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| dusk | [src/features/backdrop/scenes/dusk](../../src/features/backdrop/scenes/dusk) | `components/mainPage/backgroundAnimations/dusk` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| eep | [src/features/backdrop/scenes/eep](../../src/features/backdrop/scenes/eep) | `components/mainPage/backgroundAnimations/eep` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| eventide | [src/features/backdrop/scenes/eventide](../../src/features/backdrop/scenes/eventide) | `components/mainPage/backgroundAnimations/eventide` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| gallery | [src/features/backdrop/scenes/gallery](../../src/features/backdrop/scenes/gallery) | `components/mainPage/backgroundAnimations/gallery` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| gallery3D | [src/features/backdrop/scenes/gallery3D](../../src/features/backdrop/scenes/gallery3D) | `components/mainPage/backgroundAnimations/gallery3D` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| glitter | [src/features/backdrop/scenes/glitter](../../src/features/backdrop/scenes/glitter) | `components/mainPage/backgroundAnimations/glitter` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| gold | [src/features/backdrop/scenes/gold](../../src/features/backdrop/scenes/gold) | `components/mainPage/backgroundAnimations/gold` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| grass | [src/features/backdrop/scenes/grass](../../src/features/backdrop/scenes/grass) | `components/mainPage/backgroundAnimations/grass` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| halloween | [src/features/backdrop/scenes/halloween](../../src/features/backdrop/scenes/halloween) | `components/mainPage/backgroundAnimations/halloween` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| home | [src/features/backdrop/scenes/home](../../src/features/backdrop/scenes/home) | `components/mainPage/backgroundAnimations/home` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| meadowland | [src/features/backdrop/scenes/meadowland](../../src/features/backdrop/scenes/meadowland) | `components/mainPage/backgroundAnimations/meadowland` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| memories | [src/features/backdrop/scenes/memories](../../src/features/backdrop/scenes/memories) | `components/mainPage/backgroundAnimations/memories` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| midnight | [src/features/backdrop/scenes/midnight](../../src/features/backdrop/scenes/midnight) | `components/mainPage/backgroundAnimations/midnight` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| murk | [src/features/backdrop/scenes/murk](../../src/features/backdrop/scenes/murk) | `components/mainPage/backgroundAnimations/murk` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| perpetuity | [src/features/backdrop/scenes/perpetuity](../../src/features/backdrop/scenes/perpetuity) | `components/mainPage/backgroundAnimations/perpetuity` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| photos | [src/features/backdrop/scenes/photos](../../src/features/backdrop/scenes/photos) | `components/mainPage/backgroundAnimations/photos` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| pixelland | [src/features/backdrop/scenes/pixelland](../../src/features/backdrop/scenes/pixelland) | `components/mainPage/backgroundAnimations/pixelland` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| planetoid | [src/features/backdrop/scenes/planetoid](../../src/features/backdrop/scenes/planetoid) | `components/mainPage/backgroundAnimations/planetoid` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| projects | [src/features/backdrop/scenes/projects](../../src/features/backdrop/scenes/projects) | `components/mainPage/backgroundAnimations/projects` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| rainbow | [src/features/backdrop/scenes/rainbow](../../src/features/backdrop/scenes/rainbow) | `components/mainPage/backgroundAnimations/rainbow` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| sky | [src/features/backdrop/scenes/sky](../../src/features/backdrop/scenes/sky) | `components/mainPage/backgroundAnimations/sky` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| star | [src/features/backdrop/scenes/star](../../src/features/backdrop/scenes/star) | `components/mainPage/backgroundAnimations/star` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| storm | [src/features/backdrop/scenes/storm](../../src/features/backdrop/scenes/storm) | `components/mainPage/backgroundAnimations/storm` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| underwater | [src/features/backdrop/scenes/underwater](../../src/features/backdrop/scenes/underwater) | `components/mainPage/backgroundAnimations/underwater` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| velvet | [src/features/backdrop/scenes/velvet](../../src/features/backdrop/scenes/velvet) | `components/mainPage/backgroundAnimations/velvet` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| verdant | [src/features/backdrop/scenes/verdant](../../src/features/backdrop/scenes/verdant) | `components/mainPage/backgroundAnimations/verdant` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
| whiteout | [src/features/backdrop/scenes/whiteout](../../src/features/backdrop/scenes/whiteout) | `components/mainPage/backgroundAnimations/whiteout` | Palette mutations verified October 31; full v10 animation-phase/appearance/viewport comparison remains open |
