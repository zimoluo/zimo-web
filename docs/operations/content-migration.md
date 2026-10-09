# Content migration and recovery

The application reads final v11 keys and schemas. Migration is a separate operation; importing the application branch does not migrate the production bucket. The CLI uses the same ObjectStore interface for a local content directory or `aws`.

## Prepare and inspect

Use a local copy first. The default performs no content writes and emits a JSON report containing every source checksum, transformed output body/checksum, and issue:

```sh
npm run content:migrate -- all /absolute/content-copy --report=out/content-dry-run.json
```

Steps are `documents`, `entries`, `comments`, `reactions`, `users`, `keys`, `index`, and `all`; omitting the step selects `all`. `themes:migrate` remains the separate source-tree theme migration. `--only=slug` narrows object keys by substring; `--limit=n` bounds inputs. Options accept either `--name=value` or `--name value`. Sources can also be supplied with `--source=directory`; `--profile=aws` selects the configured production store. Content commits run serially for deterministic verification and cleanup. An explicit AWS target fails if credentials are unavailable or local-only mode is enabled; it cannot silently operate on local fixture content.

Blocking issues stop the entire commit before any mutation. Invalid dates, malformed document directives, unreadable images, schema failures, and conflicting target content are blocking. Missing authored image descriptions are reported for review. Resolve reports before proceeding. The report includes user settings/workspace and comment bodies; keep it with the private backup.

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
