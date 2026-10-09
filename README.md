# Zimo Web

This repo contains the source code of Zimo Web, released under GNU AGPLv3 license. Unless critical issues and/or liabilities are found within the website, please refrain from making pull requests and utilize the [Feedback Form](https://forms.gle/hiowUpHKcd5qpx6v8) instead. All security-related issues must be reported to me privately through my email (abgkings0920@gmail.com).

## v11 development

The `rewrite/v11` branch contains the native theme engine and Theme Studio, parameterized backdrops, windows/overlays, document renderer, notebook, and canonical content APIs. Use Node 24 with npm 10.8 or newer and install the locked dependencies with `npm ci`.

For an isolated preview that does not read or write production storage:

```sh
npm run content:seed
ZIMO_WEB_LOCAL_STORAGE_ONLY=true npm run dev
```

Production-mode local verification uses the same fixtures:

```sh
ZIMO_WEB_LOCAL_STORAGE_ONLY=true npm run build
ZIMO_WEB_LOCAL_STORAGE_ONLY=true npm run start
```

`npm run typecheck`, `npm run lint`, and `npm run test:coverage` run the main checks. Prebuild regenerates deterministic theme CSS, SVG IDs, optimized local assets, browser icons, mark posters, and celebration CSS. Generated artifacts are committed; local content, browser reports, screenshots, and logs are ignored.

Read [current status and release checks](docs/spec/exec/X8-status.md), [application contracts](docs/architecture.md), [Theme Studio](docs/implementation/theme-studio.md), [native interactions](docs/implementation/native-interactions.md), [backdrop runtime](docs/operations/backdrop-runtime.md), and [content migration](docs/operations/content-migration.md). The migration guide covers dry runs, backups, resume, verification, and rollback; a production migration remains a separate operational step.

The repository retains its ban on implementation comments. External-system/effect explanations live in documentation.
