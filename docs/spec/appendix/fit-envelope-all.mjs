// Prints the three-envelope comparison quoted in F-12, T2 §5.3, and ADR-003.
import { execFileSync } from "node:child_process";
console.log("envelope comparison — residual |Δ relative chroma| after fitting per-theme seed chroma\n");
for (const env of ["flat", "gentle", "taper"]) {
  process.stdout.write(execFileSync("node", ["fit-envelope.mjs"], { env: { ...process.env, ENV: env } }));
}
