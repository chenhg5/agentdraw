import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = path.join(workspaceRoot, "apps", "web");
const packageEntry = require.resolve("@excalidraw/excalidraw", { paths: [webRoot] });
const packageRoot = path.resolve(path.dirname(packageEntry), "../..");
const fontsSource = path.join(path.dirname(packageEntry), "fonts");
const webDistAssets = path.join(webRoot, "dist", "assets");
const fontsTarget = path.join(webDistAssets, "fonts");

await mkdir(webDistAssets, { recursive: true });
await rm(fontsTarget, { recursive: true, force: true });
await cp(fontsSource, fontsTarget, { recursive: true });
await writeXiaolaiCss(packageRoot, webDistAssets);
await injectXiaolaiCssLink(path.join(webRoot, "dist", "index.html"));

console.log(`Copied Excalidraw font assets to ${path.relative(workspaceRoot, fontsTarget)}`);

async function writeXiaolaiCss(packageRootPath, assetsDir) {
  const devDir = path.join(packageRootPath, "dist", "dev");
  const candidates = await readdir(devDir);
  const chunkPath = (
    await Promise.all(
      candidates
        .filter((file) => file.endsWith(".js"))
        .map(async (file) => {
          const candidatePath = path.join(devDir, file);
          const text = await readFile(candidatePath, "utf8");
          return text.includes("var XiaolaiFontFaces") ? candidatePath : null;
        }),
    )
  ).find(Boolean);
  if (!chunkPath) {
    throw new Error("Could not find Excalidraw dev chunk with Xiaolai font metadata.");
  }

  const bundle = await readFile(chunkPath, "utf8");
  const variableToFile = new Map();
  for (const match of bundle.matchAll(
    /var\s+([A-Za-z0-9_]+_default)\s*=\s*"\.\/fonts\/Xiaolai\/([^"]+\.woff2)";/g,
  )) {
    variableToFile.set(match[1], match[2]);
  }

  const css = [];
  for (const match of bundle.matchAll(
    /uri:\s*([A-Za-z0-9_]+_default),\s*descriptors:\s*\{\s*unicodeRange:\s*"([^"]+)"\s*\}/g,
  )) {
    const file = variableToFile.get(match[1]);
    const unicodeRange = match[2];
    if (!file) {
      continue;
    }
    css.push(
      [
        "@font-face {",
        "  font-family: \"Xiaolai\";",
        `  src: url("/assets/fonts/Xiaolai/${file}") format("woff2");`,
        "  font-weight: 400;",
        "  font-style: normal;",
        "  font-display: swap;",
        `  unicode-range: ${unicodeRange};`,
        "}",
      ].join("\n"),
    );
  }

  if (css.length === 0) {
    throw new Error("Could not generate Xiaolai font-face CSS from Excalidraw bundle.");
  }

  await writeFile(path.join(assetsDir, "agentdraw-xiaolai.css"), `${css.join("\n\n")}\n`);
}

async function injectXiaolaiCssLink(indexHtmlPath) {
  const marker = '<link rel="stylesheet" href="/assets/agentdraw-xiaolai.css">';
  const html = await readFile(indexHtmlPath, "utf8");
  if (html.includes(marker)) {
    return;
  }
  await writeFile(indexHtmlPath, html.replace("</head>", `${marker}</head>`));
}
