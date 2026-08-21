# Appendix — executable references

Every quantitative color claim in this spec is produced by these scripts. They are committed so
that a number can be re-derived rather than argued about. Run with plain `node`, no install.

| File | Produces |
| --- | --- |
| `oklch.mjs` | The shared library: `cMax`, `oklchToHex`, `hexToOklch`. Mirrors T2 §3–4. |
| `gamut-table.mjs` | `gamut-table.md` — the sRGB chroma ceiling. Evidence for ADR-001. |
| `corpus.mjs` | `corpus-analysis.md` — all 59 themes decoded. Evidence for F-11, ADR-002. |
| `fit-discrete.mjs` | The discrete-rung fit ΔE_OK distribution. Evidence for ADR-002.<br>**Uses the *rejected* taper envelope**, because that is what the original measurement used. Its "ramp" tables are therefore **not** the canonical test vectors — T2 §5.7 is, and it uses the flat envelope. The script says so on stdout. |
| `fit-envelope.mjs` | One envelope's residuals; `ENV=flat|gentle|taper`. |
| `fit-envelope-all.mjs` | All three rows of the envelope comparison. Evidence for F-12, ADR-003. |

```sh
cd docs/spec/appendix
node gamut-table.mjs      > gamut-table.md      # regenerates byte-identically
node corpus.mjs           > corpus-analysis.md  # regenerates byte-identically
node fit-discrete.mjs                           # T9 §1 / ADR-002 numbers
node fit-envelope-all.mjs                       # F-12 / ADR-003 table
```

`corpus.mjs`, `fit-discrete.mjs`, and `fit-envelope.mjs` read
`components/theme/config/*.ts` by absolute path. After the v11 migration those files no longer
exist, at which point these three scripts have served their purpose and become historical —
`gamut-table.mjs` and `oklch.mjs` remain useful, and their logic is superseded by
`features/theme/color/` with the test vectors in T2 §5.7 as the contract between them.

Both `.md` files in this directory are generated output and regenerate byte-identically from
their scripts. Do not hand-edit them; fix the script.

> `oklch.mjs`'s OKLab forward matrix contains the coefficient `-2.4285922050`. A one-order-of-
> magnitude typo there (`-0.2428592205`) produces plausible-looking garbage — chroma above 1,
> all hues collapsing near 355°. T2 §3 makes this a required unit test.
