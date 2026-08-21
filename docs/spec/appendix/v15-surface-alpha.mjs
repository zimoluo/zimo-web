import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const PORT = Number(process.env.WEBDRIVER_PORT ?? 4455);
const BASE = `http://127.0.0.1:${PORT}`;
const HERE = dirname(fileURLToPath(import.meta.url));
const PAGE = `file://${join(HERE, "v15-surface-alpha.html")}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const call = async (method, path, body) => {
  const args = ["-s", "-m", "60", "-X", method, `${BASE}${path}`];
  if (body !== undefined) {
    args.push("-H", "Content-Type: application/json", "-d", JSON.stringify(body));
  }
  const raw = execFileSync("curl", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const json = JSON.parse(raw);
  if (json.value?.error) {
    throw new Error(`${json.value.error}: ${json.value.message}`);
  }
  return json.value;
};

const driver = { kill: () => undefined };

let ready = false;
for (let attempt = 0; attempt < 10 && !ready; attempt += 1) {
  try {
    const status = await call("GET", "/status");
    ready = status.ready === true;
  } catch {
    ready = false;
  }
  if (!ready) await sleep(400);
}
if (!ready) {
  console.error(
    `No WebDriver server on port ${PORT}.\n` +
      `Start one first, detached from this process:\n\n` +
      `  ( safaridriver -p ${PORT} & )\n\n` +
      `safaridriver does not bind when spawned as a child process, so it must be\n` +
      `started separately. Safari also requires Settings > Developer >\n` +
      `"Allow remote automation".`,
  );
  process.exit(1);
}

const session = await call("POST", "/session", {
  capabilities: { alwaysMatch: { browserName: "safari" } },
});
const id = session.sessionId;

const finish = async (code) => {
  try {
    await call("DELETE", `/session/${id}`);
  } catch {
    /* already gone */
  }
  driver.kill();
  process.exit(code);
};

try {
  await call("POST", `/session/${id}/window/rect`, {
    x: 0,
    y: 0,
    width: 500,
    height: 600,
  });
  await call("POST", `/session/${id}/url`, { url: PAGE });
  await sleep(700);

  const probe = await call("POST", `/session/${id}/execute/sync`, {
    script: `
      const read = (id) => {
        const el = document.getElementById(id);
        const rect = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          backgroundImage: cs.backgroundImage,
          alphaProperty: cs.getPropertyValue("--zw-surface-widget-alpha").trim(),
          beforeOpacity: getComputedStyle(el, "::before").opacity,
        };
      };
      return {
        innerWidth: window.innerWidth,
        broken: read("broken"),
        works: read("works"),
        full: read("full"),
      };
    `,
    args: [],
  });

  const shotBase64 = await call("GET", `/session/${id}/screenshot`);
  const image = sharp(Buffer.from(shotBase64, "base64"));
  const meta = await image.metadata();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  const scale = info.width / probe.innerWidth;
  const PATCH = 10;
  const patchAt = (cssX, cssY) => {
    const cx = Math.round(cssX * scale);
    const cy = Math.round(cssY * scale);
    const totals = [0, 0, 0];
    let count = 0;
    for (let dy = -PATCH; dy <= PATCH; dy += 1) {
      for (let dx = -PATCH; dx <= PATCH; dx += 1) {
        const offset = ((cy + dy) * info.width + (cx + dx)) * info.channels;
        totals[0] += data[offset];
        totals[1] += data[offset + 1];
        totals[2] += data[offset + 2];
        count += 1;
      }
    }
    return totals.map((total) => total / count);
  };

  const brokenPixel = patchAt(probe.broken.centerX, probe.broken.centerY);
  const worksPixel = patchAt(probe.works.centerX, probe.works.centerY);
  const fullPixel = patchAt(probe.full.centerX, probe.full.centerY);

  const AUTHORED_ALPHA = 0.25;
  const WHITE = 255;

  const noiseFloor = Math.max(
    ...brokenPixel.map((value, index) => Math.abs(value - fullPixel[index])),
  );
  const budget = Math.max(3, noiseFloor + 1);

  const predictedIfHonored = fullPixel.map(
    (value) => WHITE - AUTHORED_ALPHA * (WHITE - value),
  );
  const predictedIfIgnored = fullPixel;

  const maxDeviation = (a, b) =>
    Math.max(...a.map((value, index) => Math.abs(value - b[index])));

  const alphaFromChannels = (sample) => {
    const ratios = sample
      .map((value, index) => ({ value, span: WHITE - fullPixel[index] }))
      .filter(({ span }) => span > 20)
      .map(({ value, span }) => (WHITE - value) / span);
    return ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
  };

  const brokenAlpha = alphaFromChannels(brokenPixel);
  const worksAlpha = alphaFromChannels(worksPixel);

  const round1 = (values) => values.map((value) => Math.round(value * 10) / 10);

  console.log(
    `=== V-15 browser repro — Safari ${session.capabilities.browserVersion} (WebKit) ===`,
  );
  console.log(
    `screenshot ${info.width}x${info.height}, scale ${scale}, format ${meta.format}`,
  );
  console.log(`patch ${PATCH * 2 + 1}px square averaged per probe\n`);
  console.log(`Authored on both probe elements: --zw-surface-widget-alpha: ${AUTHORED_ALPHA}\n`);
  console.log("Averaged patches over white #ffffff:");
  console.log("  alpha=1 reference paint                     :", round1(fullPixel));
  console.log("  FORM 1  var() inside image string on <html> :", round1(brokenPixel));
  console.log("  FORM 2  opacity on a ::before paint layer   :", round1(worksPixel));
  console.log();
  console.log("Capture noise floor, from two patches that must be identical");
  console.log("  |FORM 1 - reference|_max                    :", noiseFloor.toFixed(2));
  console.log("  tolerance budget used                       :", budget.toFixed(2));
  console.log();
  console.log("Predicted patches:");
  console.log("  if the element alpha is honored             :", round1(predictedIfHonored));
  console.log("  if the element alpha is ignored             :", round1(predictedIfIgnored));
  console.log();
  console.log("Deviation of each observation from each prediction:");
  console.log("  FORM 1 vs ignored :", maxDeviation(brokenPixel, predictedIfIgnored).toFixed(2));
  console.log("  FORM 1 vs honored :", maxDeviation(brokenPixel, predictedIfHonored).toFixed(2));
  console.log("  FORM 2 vs honored :", maxDeviation(worksPixel, predictedIfHonored).toFixed(2));
  console.log("  FORM 2 vs ignored :", maxDeviation(worksPixel, predictedIfIgnored).toFixed(2));
  console.log();
  console.log("Inferred effective alpha (channel-averaged):");
  console.log("  FORM 1:", brokenAlpha.toFixed(4));
  console.log("  FORM 2:", worksAlpha.toFixed(4));
  console.log();
  console.log("Computed values, which are noise-free:");
  console.log("  FORM 1 --zw-surface-widget-alpha on element :", probe.broken.alphaProperty);
  console.log(
    "  FORM 1 computed background-image            :",
    probe.broken.backgroundImage.slice(0, 150),
  );
  console.log("  FORM 2 ::before opacity                     :", probe.works.beforeOpacity);
  console.log();

  const form1Ignores =
    maxDeviation(brokenPixel, predictedIfIgnored) <= budget &&
    maxDeviation(brokenPixel, predictedIfHonored) > budget;
  const form2Honors =
    maxDeviation(worksPixel, predictedIfHonored) <= budget &&
    maxDeviation(worksPixel, predictedIfIgnored) > budget &&
    Number(probe.works.beforeOpacity) === AUTHORED_ALPHA;

  console.log("VERDICT");
  console.log(
    "  Form 1 ignores the element-level alpha (spec predicts YES):",
    form1Ignores ? "YES" : "NO",
  );
  console.log(
    "  Form 2 honors the element-level alpha  (spec predicts YES):",
    form2Honors ? "YES" : "NO",
  );
  console.log();

  if (form1Ignores && form2Honors) {
    console.log("V-15 CONFIRMED — T4 §1.1 holds on both halves. T4-01 is unblocked.");
    await finish(0);
  } else {
    console.log("V-15 FAILED — T4 §1.1's premise does not hold. Take a T4 §1.1 alternative.");
    await finish(1);
  }
} catch (error) {
  console.error("V-15 repro error:", error.message);
  await finish(2);
}
