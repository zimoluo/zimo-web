# Content migration and recovery

The application reads final v11 keys and schemas. Migration is a separate operation; importing the application branch does not migrate the production bucket. The CLI uses the same ObjectStore interface for a local content directory or `aws`.

## Prepare and inspect

Use a local copy first. The default performs no content writes and emits a JSON report containing every source checksum, transformed output body/checksum, and issue:

```sh
npm run content:migrate -- all /absolute/content-copy --report=out/content-dry-run.json
```

Steps are `documents`, `entries`, `comments`, `reactions`, `users`, `keys`, `index`, and `all`; omitting the step selects `all`. `themes:migrate` remains the separate source-tree theme migration. `--only=slug` narrows object keys by substring; `--limit=n` bounds inputs. Options accept either `--name=value` or `--name value`. Sources can also be supplied with `--source=directory`; `--profile=aws` selects the configured production store. Content commits run serially for deterministic verification and cleanup. An explicit AWS target fails if credentials are unavailable or local-only mode is enabled; it cannot silently operate on local fixture content.

Blocking issues stop the entire commit before any mutation. Invalid dates, malformed document directives, unreadable images, schema failures, and conflicting target content are blocking. Missing authored image descriptions are reported for review. Resolve reports before proceeding. The report includes user settings/workspace and comment bodies; keep it with the private backup.

## Authored legacy metadata

Project links retain their authored purposes: `github: owner/repository` becomes an absolute GitHub source URL, `zimo-blog: slug` becomes `/blog/slug` with article kind, and download links retain download kind. Invalid repository shorthand or blog slugs block migration. Legacy avatar filenames such as `eunoe.svg` become a stable author ID while their exact original bucket URL is measured and retained; explicit photo profile URLs take precedence over the author registry. Known registry identities retain their registered artwork. A name alone does not imply a fabricated avatar URL, and an absent author remains an empty author list.

Blank edited dates are omitted. Legacy timestamps with a time but no zone are interpreted as UTC, so migration does not depend on the machine's local time zone. `displayCover` and converted cover `displayAtBeginning` metadata survive as an optional native boolean. A false value hides the opening cover viewer while preserving the measured cover in listings and indexes; omission keeps the normal reader behavior. Non-project metadata does not undergo project-link parsing.

Converted legacy blog JSON can contain rich document trees under `body`; these are explicitly blocked before any output or image measurement. Select the authored Markdown counterpart in the operational staging set rather than discarding those nodes or publishing an empty article. This selection is an operational decision, not automatic deletion of source content.

Legacy comments and home messages may be arrays or wrapped as `{comments: [...]}`; both forms migrate through the same deterministic identity and reply-target mapping. Native wrappers remain validated and unchanged on repeat runs. Christmas-tree `{treeContent: [...]}` objects migrate into the native messages collection, retaining positions, authored IDs, privacy and spoiler flags. Existing ornaments with an authored empty message remain readable and occupy their original position. New submissions still require nonempty names and messages through `requireTreeText`; migration does not invent a body for those ornaments.

On 2026-10-10, a read-only metadata audit inspected 86 local source objects and 178 remote-snapshot objects. The local set had zero transformation errors or blocking issues. The remote set had zero transformation errors; all 56 converted rich-tree JSON documents were explicitly blocked, leaving 122 structurally convertible objects. The audit used deterministic image-measurement stubs and therefore establishes metadata/parser behavior only, not actual media availability or dimensions. Both source directories remained untouched; the local report is `work/backend-migration/metadata-audit.json`. A separate read-only audit of all 14 previously blocked wrapped comment/home/tree records produced 14 validated output objects with zero errors or blocking issues, including the original empty-message ornament; its content-free status report is `work/backend-migration/wrapper-audit.json`. Focused migration/entry/HTTP/reader/tree regressions passed 215 tests, including hidden opening covers, avatar preservation, shorthand URLs, blank dates, unsupported trees, wrapped records and unchanged new-submission validation; strict type checking and focused lint passed.

## Apply and verify

```sh
npm run content:migrate -- all /absolute/content-copy --commit --backup=work/content-backup/run1 --report=out/content-commit.json
npm run content:migrate -- all /absolute/content-copy --verify --report=out/content-verify.json
npm run content:reindex -- /absolute/content-copy --check
```

Before the first content mutation, the harness saves every original input, existing output target, and section index. Its manifest records SHA-256, byte count, ETag, and keys that were absent. It validates the backup, restores it into an isolated local directory, and checks restored object count. Each output uses conditional writes and is read back for byte verification. Renamed source keys are removed only after all outputs verify and their original ETags are rechecked. Indexes rebuild last.

UUIDv7 comment/reply/page identities are deterministic from source identity and creation time, so dry-run and commit output agree. Native schema markers make a second run a no-op. `--verify` checks that no transformation remains and every section index agrees with the validated metadata.

Stop application mutations during a production migration. Object-level CAS protects individual updates; the sequence of related key renames is not a bucket-wide transaction. Production migration still requires review of its actual corpus report and backup, including any authored repairs.

## Resume or restore

```sh
npm run content:migrate -- all /absolute/content-copy --commit --backup=work/content-backup/run1 --resume=out/content-commit.json --report=out/content-resume.json
npm run content:restore -- work/content-backup/run1 --target=/absolute/content-copy
npm run content:restore -- work/content-backup/run1 --target=/absolute/content-copy --confirm
```

Resume uses the same backup directory. It preserves the original manifest, verifies already-written outputs, and finishes source cleanup before rebuilding indexes. Restore defaults to a read-only manifest inspection. `--confirm` verifies every backup checksum before mutations, removes keys recorded as originally absent, restores original bytes, and verifies each restored object. Omit `--target` only when deliberately targeting the configured remote store.

## Measured local exercise (2026-10-09)

Eight isolated legacy objects covered Markdown/marks/component aliases, measured local album media, comment and reply identity, reactions, home references, about text, user notebook spans, and tree privacy/spoiler fields. Dry-run wrote zero objects; commit wrote 13 objects including four indexes; every index matched; a repeat commit wrote zero; read-only verification succeeded. The backup was restored into an isolated check directory before writes. Unit regressions also restored the original prefix after a commit, rejected a corrupted backup before writes, and resumed an interruption after output writes but before source deletion.

Artifacts are local, ignored files under `work/legacy-migration-*.json` and `work/legacy-migration-backup/`. These establish tooling behavior; they are not evidence that the production corpus is ready to mutate.

## Isolated v11 bucket rollout

The remote runtime defaults to the `v11/` namespace in the existing bucket. Logical keys, schemas and public media URLs remain unchanged. `ZIMO_WEB_STORAGE_PREFIX` overrides that remote namespace for explicit operational targets and must be empty or a sequence of folder names ending in `/`; local filesystem storage is unaffected. Direct `createObjectStore(sender)` calls remain unscoped for deliberate legacy-source inspection. Conditional writes, reads, removals and paginated listings all apply the namespace, and listings return logical keys.

The October 10 rollout uses an isolated upload rather than the in-place migration harness's rename cleanup. Legacy bucket keys continue serving the current site. Migrated v11 objects are inserted conditionally, checked against their staged SHA-256 values, and indexed only after their content verifies. Old project/user/comment formats are not overwritten. Existing media URLs are reused; the OneDrive source folders and uploader scripts remain unchanged. Visitor records are a snapshot: refresh their migration at deployment cutover if the old site has received further writes.

### October 10 completed upload

The staged production rehearsal selected 238 source objects, preferring the complete authored Markdown posts over 56 converted rich-tree JSON duplicates. All 129 entries validated: 65 blog, 21 projects, 36 album and 7 management. Actual image measurements were cached for 904 distinct URLs. There were zero blocking issues and 501 nonblocking reports, principally missing authored image descriptions and legacy shared-ratio differences. Those reports remain private for editorial review; migration does not invent descriptions.

All 314 canonical objects, including document metadata, existing visitor records and four indexes, were uploaded under `v11/` and verified by read-back SHA-256. The 238 original remote records were backed up and restored successfully into an isolated local check directory first. No root source key was deleted or overwritten. All 542 copied OneDrive files were rehashed at their original paths with zero changes. All 447 staged media files already had bucket counterparts: 431 matched ordinary ETag MD5 checks; remaining differences were multipart ETags and processed SVGs. Existing published media URLs were retained rather than replacing them with authoring copies.

Evidence is private and ignored under `work/backend-migration`: `dry-run.json`, `upload-backup/manifest.json`, `upload-result.json`, `target-before.json`, `originals-verification.json`, and `cas-check.json`. Conditional creation and update were exercised on one unique temporary verification key; stale If-Match and duplicate If-None-Match writes returned 412, and cleanup was verified. Bucket-versioning inspection returned AccessDenied, so versioning remains unconfirmed. The first upload attempt stopped before writes during a transient DNS failure; the completed retry verified every output and index.

Public entry, feed and author cache keys include the local root or remote bucket namespace. This prevents a shared build cache from serving fixture, rehearsal or earlier-namespace results after switching backends. Identity/session filtering and tag invalidation retain their existing behavior.
