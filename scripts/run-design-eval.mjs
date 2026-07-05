#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const evalCaseRoot = join(root, "evals", "cases");
const evalCases = {
  "technical-article": {
    id: "technical-article",
    title: "Technical article visual for engineers",
    source: join(evalCaseRoot, "technical-article.md"),
    expectedPlaybook: "article-visual, adapting layered-architecture only if it improves the article image",
    prompt:
      "Create an editable board that helps engineers understand the local quality loop described in the article.",
  },
  ppt: {
    id: "ppt",
    title: "Review visual with explicit slide request",
    source: join(evalCaseRoot, "ppt-executive.md"),
    expectedPlaybook: "ppt-visual",
    prompt:
      "Create one slide-like visual for leadership because this case explicitly asks for a deck page. It should make one assertion and support it with three concise pillars.",
  },
  "self-media": {
    id: "self-media",
    title: "Self-media article illustration",
    source: join(evalCaseRoot, "self-media-article.md"),
    expectedPlaybook: "article-visual",
    prompt:
      "Create a public-facing article illustration that makes the core contrast memorable and readable as a blog hero image.",
  },
  teaching: {
    id: "teaching",
    title: "Teaching board",
    source: join(evalCaseRoot, "teaching-cache.md"),
    expectedPlaybook: "teaching-board",
    prompt:
      "Create a Khan-style teaching board for developers learning prompt prefix cache invalidation. It should feel like a worked lesson with examples, chalk annotations, and a rule of thumb, not a card wall.",
  },
  flow: {
    id: "flow",
    title: "Technical flowchart",
    source: join(evalCaseRoot, "user-auth-flow.md"),
    expectedPlaybook: "technical-flowchart",
    prompt:
      "Create a professional editable registration/login flowchart with start/end states, decisions, branch labels, and retry loops.",
  },
  architecture: {
    id: "architecture",
    title: "System architecture board",
    source: join(evalCaseRoot, "local-agent-architecture.md"),
    expectedPlaybook: "layered-architecture",
    prompt:
      "Create an editable architecture board for the local agent drawing runtime, with clear layers and boundaries.",
  },
};
const args = parseArgs(process.argv.slice(2));
const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "");
const sourcePath = args.source ?? process.env.AGENTDRAW_EVAL_SOURCE;
const selectedCases = selectCases(args.case ?? args.cases, sourcePath);

if (!sourcePath && selectedCases.length === 0) {
  fail(
    [
      "Missing eval source document or eval case.",
      "Run the default built-in suite: pnpm eval:design",
      "Run one case: pnpm eval:design -- --case teaching",
      "Run with an agent: pnpm eval:design -- --case all --agent codex",
      "Or pass --source <local-or-remote-path> for a custom source document.",
    ].join("\n"),
  );
}

const outRoot = resolve(root, args.out ?? ".agentdraw/evals");
const runName = args.name ?? defaultRunName(selectedCases, timestamp);
const runDir = join(outRoot, runName);
const promptPath = join(runDir, "prompt.md");
const rubricPath = join(runDir, "rubric.md");
const agent = args.agent ?? "none";
const stylePlan = parseList(args.styles ?? args.style);
const sourceCopies = [];

mkdirSync(join(runDir, "input"), { recursive: true });
mkdirSync(join(runDir, "outputs"), { recursive: true });

if (sourcePath) {
  const sourceCopy = join(runDir, "input", basename(sourcePath));
  fetchSource(sourcePath, sourceCopy, args);
  sourceCopies.push({
    id: "custom-source",
    title: "Custom source document",
    expectedPlaybook: "choose from skill",
    prompt: "Create the requested boards from this custom source.",
    source: sourceCopy,
  });
} else {
  for (const evalCase of selectedCases) {
    const sourceCopy = join(runDir, "input", basename(evalCase.source));
    copyFile(evalCase.source, sourceCopy);
    sourceCopies.push({ ...evalCase, source: sourceCopy });
  }
}

writeFileSync(rubricPath, rubric(), "utf8");
writeFileSync(promptPath, prompt(sourceCopies, runDir, stylePlan), "utf8");

console.log(`AgentDraw design eval prepared: ${runDir}`);
console.log(`Cases: ${sourceCopies.map((item) => item.id).join(", ")}`);
for (const item of sourceCopies) {
  console.log(`Source [${item.id}]: ${item.source}`);
}
console.log(`Prompt: ${promptPath}`);
console.log(`Rubric: ${rubricPath}`);

if (agent === "none") {
  console.log("");
  console.log("Run one of:");
  console.log(`  codex exec --dangerously-bypass-approvals-and-sandbox -C ${shellQuote(root)} < ${shellQuote(promptPath)}`);
  console.log(`  claude --print --permission-mode bypassPermissions --add-dir ${shellQuote(root)} < ${shellQuote(promptPath)}`);
  console.log("");
  console.log("Or rerun this script with an agent:");
  console.log(`  pnpm eval:design -- --case ${args.case ?? args.cases ?? "all"} --agent codex --name ${runName}`);
  console.log(`  pnpm eval:design -- --case ${args.case ?? args.cases ?? "all"} --agent claude --name ${runName}`);
  process.exit(0);
}

runAgent(agent, promptPath);
postCheck(runDir, args.style);

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--") {
      continue;
    }
    if (!value.startsWith("--")) {
      continue;
    }
    const [key, inline] = value.slice(2).split("=", 2);
    parsed[toCamel(key)] = inline ?? values[index + 1];
    if (inline === undefined) {
      index += 1;
    }
  }
  return parsed;
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function parseList(value) {
  if (!value) {
    return [];
  }
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function selectCases(value, customSource) {
  if (customSource) {
    return [];
  }
  const requested = parseList(value ?? "all");
  const ids = requested.includes("all") ? Object.keys(evalCases) : requested;
  return ids.map((id) => {
    const normalized = caseAlias(id);
    const evalCase = evalCases[normalized];
    if (!evalCase) {
      fail(`Unknown eval case: ${id}\nAvailable cases: ${Object.keys(evalCases).join(", ")}, all`);
    }
    return evalCase;
  });
}

function caseAlias(value) {
  const normalized = String(value).trim().toLowerCase();
  const aliases = {
    article: "self-media",
    blog: "self-media",
    media: "self-media",
    ppt: "ppt",
    slide: "ppt",
    slides: "ppt",
    teaching: "teaching",
    education: "teaching",
    flow: "flow",
    flowchart: "flow",
    auth: "flow",
    architecture: "architecture",
    system: "architecture",
    technical: "technical-article",
    "tech-article": "technical-article",
  };
  return aliases[normalized] ?? normalized;
}

function defaultRunName(cases, timestamp) {
  if (cases.length === 0) {
    return `custom-${timestamp}`;
  }
  if (cases.length === Object.keys(evalCases).length) {
    return `playbook-all-${timestamp}`;
  }
  return `playbook-${cases.map((item) => item.id).join("-")}-${timestamp}`;
}

function fetchSource(source, destination, options) {
  if (existsSync(source)) {
    copyFile(source, destination);
    return;
  }

  const sshUser = options.sshUser ?? "chicken";
  const sshHost = options.sshHost ?? "localhost";
  const sshPort = options.sshPort ?? "2222";
  const remote = `${sshUser}@${sshHost}:${source}`;
  const result = spawnSync("scp", ["-P", sshPort, remote, destination], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    fail(
      [
        `Could not copy source document from local path or SSH: ${source}`,
        result.stderr.trim(),
        `Try: scp -P ${sshPort} ${remote} ${destination}`,
      ].join("\n"),
    );
  }
}

function copyFile(source, destination) {
  writeFileSync(destination, readFileSync(source));
}

function prompt(sources, directory, styles) {
  const styleInstruction =
    styles.length > 0
      ? `\n## Style Test Plan\n\nUse these exact AgentDraw styles for this eval: ${styles.map((style) => `\`${style}\``).join(", ")}.\n\nCreate one polished board per listed style. Reuse the source document, but vary the board topic and composition so the style's design language is visible. Do not silently switch to another style. For each style, load both \`pnpm agentdraw guide style <style-id> --format text\` and \`pnpm agentdraw guide contract <style-id> --json\` before drafting.\n`
      : "";
  const taskList =
    styles.length > 0
      ? `Create **${styles.length} polished editable boards**, one for each style in the style test plan. Use the provided source material to choose suitable topics, and make each board demonstrate the selected style's layout, typography, geometry, and component language.`
      : taskListForSources(sources);
  const sourceList = sources
    .map(
      (item, index) =>
        `${index + 1}. **${item.id}**: ${item.title}\n   - Source: ${item.source}\n   - Expected playbook: ${item.expectedPlaybook}\n   - Task: ${item.prompt}`,
    )
    .join("\n");
  return `# AgentDraw Isolated Design Evaluation

You are an isolated agent testing AgentDraw's skill and design systems.

## Inputs

- AgentDraw repo: ${root}
- Skill entry: ${join(root, "skills/agentdraw/SKILL.md")}
- Source documents:
${sourceList}
- Output directory: ${join(directory, "outputs")}
- Rubric: ${join(directory, "rubric.md")}
- Runtime command for this eval: \`pnpm agentdraw\` from the AgentDraw repo root.
${styleInstruction}

## Task

Read the source documents and the AgentDraw skill. ${taskList}

Use freeform restricted SVG as the source. Do not use a fixed template DSL. If no style test plan is provided, pick the most suitable AgentDraw style for each board, or reuse one style if you have a clear reason. State the style choice and reason in your notes.

For each board:

- extract and state the source's one-sentence core message;
- choose and state the visual expression pattern before choosing style;
- identify and state the selected scene playbook before choosing style;
- read \`skills/agentdraw/method/drawing-method.md\` and the selected playbook;
- write a short layout plan before writing SVG;
- write a source SVG under the output directory;
- import it with \`pnpm agentdraw import-svg\`;
- run \`pnpm agentdraw repair --write\`;
- run \`pnpm agentdraw validate --format json\`;
- run \`pnpm agentdraw quality --format json\`;
- export a PNG preview;
- revise the source SVG if quality or visual inspection reveals weak layout, misalignment, excessive whitespace, text issues, connector issues, or style-contract drift.

Hard requirements:

- no emoji;
- no prompt/source-path/tooling metadata on the canvas;
- no handwritten font for Chinese or mixed-language text;
- no random green/orange/red unless the selected style explicitly includes it;
- repeated cards should align and usually share dimensions;
- large lanes/panels should use width deliberately, not leave tiny floating cards;
- coordinates and sizes should follow a 4/8/16px rhythm;
- final boards should look intentionally designed when zoomed out.
- use the repo-local CLI with \`pnpm agentdraw\`; do not use a globally installed \`agentdraw\`
  binary because it may be an older published version and would not test the current repository.

Write \`${join(directory, "outputs", "notes.md")}\` with:

- the playbook selected for each board and why;
- the source's core message and visual expression pattern for each board;
- the style selected for each board and why;
- the layout plan for each board;
- commands run;
- validation and quality summaries;
- any accepted weaknesses.

Do not commit or publish anything.
`;
}

function taskListForSources(sources) {
  if (sources.length === 1 && sources[0].id === "custom-source") {
    return `Create **three polished editable boards** from the document:

1. **architecture-or-concept**: explain the source's core system or concept model.
2. **process-or-mechanism**: explain the most important process, mechanism, or decision flow.
3. **audience-summary**: create either a slide-like or article-like visual for the source's main message.`;
  }
  return `Create **one polished editable board per source document**. Use the expected playbook as a strong hint, but still state your own playbook choice and reason. Name outputs with each case id, for example \`technical-article.svg\`, \`technical-article.agentdraw.json\`, and \`technical-article.png\`.`;
}

function rubric() {
  return `# AgentDraw Human Rating Rubric

Score each board from 1 to 5 in each dimension.

## Visual Structure

5: clear hierarchy, strong sections, obvious reading path, looks designed when zoomed out.
3: understandable but generic or slightly scattered.
1: random boxes, weak hierarchy, or confusing structure.

## Alignment And Spacing

5: repeated elements align, share dimensions, and use whitespace deliberately.
3: mostly aligned with some awkward gaps or uneven cards.
1: visible drift, uneven card sizes, excessive empty space, or cramped regions.

## Style Fidelity

5: style affects layout, typography, geometry, components, and color.
3: mostly a palette swap with some style details.
1: violates palette/typography or looks like default boxes.

## Readability

5: text is legible, contained, well grouped, and not too small.
3: readable with minor density or centering issues.
1: clipped, too small, overlapping, or hard to scan.

## Content Fit

5: board captures the source document's key idea with useful abstraction.
3: covers the topic but misses important nuance or has weak summarization.
1: generic, inaccurate, or disconnected from the document.

## Editability

5: editable objects, clean connectors, no rasterized text or decorative clutter.
3: mostly editable with minor cleanup needed.
1: not meaningfully editable or full of broken elements.

Suggested pass bar: average >= 4.0 and no dimension below 3.
`;
}

function runAgent(name, promptFile) {
  const promptText = readFileSync(promptFile, "utf8");
  if (name === "codex") {
    run("codex", [
      "exec",
      "--dangerously-bypass-approvals-and-sandbox",
      "-C",
      root,
      promptText,
    ]);
    return;
  }
  if (name === "claude") {
    run("claude", [
      "--print",
      "--permission-mode",
      "bypassPermissions",
      "--add-dir",
      root,
      promptText,
    ]);
    return;
  }
  fail(`Unsupported --agent ${name}. Use --agent codex, --agent claude, or omit --agent.`);
}

function postCheck(directory, styleArg) {
  const scenes = findFiles(join(directory, "outputs"), ".agentdraw.json");
  if (scenes.length === 0) {
    console.log("No .agentdraw.json files found for post-check.");
    return;
  }
  for (const scene of scenes) {
    const style = styleArg ?? readStyleId(scene);
    const base = scene.replace(/\.agentdraw\.json$/, "");
    const common = style ? ["--style", style] : [];
    run("pnpm", ["agentdraw", "validate", scene, ...common, "--format", "json"], { allowFail: true });
    run("pnpm", ["agentdraw", "quality", scene, ...common, "--format", "json"], { allowFail: true });
    run("pnpm", ["agentdraw", "export", scene, "--format", "png", "--out", `${base}.postcheck.png`, "--json"], { allowFail: true });
  }
}

function readStyleId(file) {
  try {
    const scene = JSON.parse(readFileSync(file, "utf8"));
    return typeof scene.styleId === "string" ? scene.styleId : undefined;
  } catch {
    return undefined;
  }
}

function findFiles(directory, suffix) {
  if (!existsSync(directory)) {
    return [];
  }
  const entries = readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      return findFiles(fullPath, suffix);
    }
    return entry.isFile() && entry.name.endsWith(suffix) ? [fullPath] : [];
  });
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.status !== 0 && !options.allowFail) {
    fail(`Command failed: ${command} ${commandArgs.join(" ")}`);
  }
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
