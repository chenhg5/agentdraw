#!/usr/bin/env node
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  importSvgToAgentDrawScene,
  normalizeScenePath,
  repairScene,
  readOrCreateSceneFile,
  readSceneFile,
  validateScene,
  writeSceneFile,
  type AgentDrawScene,
  type SceneValidationIssue,
} from "@agentdraw/scene";
import { startAgentDrawServer } from "@agentdraw/server";
import {
  getDesignContract,
  styles,
  styleGroups,
  validateDesignGuide,
  validateSceneAgainstDesignContract,
  type DesignContractIssue,
} from "@agentdraw/styles";
import { renderScenePng, renderSceneSvg, type RenderFormat } from "./render.js";

const VERSION = readPackageVersion();
const DEFAULT_PORT = 3927;
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_SCENE = ".agentdraw/untitled.agentdraw.json";
const EXIT_GENERAL_ERROR = 1;
const EXIT_USAGE_ERROR = 2;

type OutputFormat = "json" | "text";

type GlobalOptions = {
  cwd: string;
  format?: OutputFormat;
  noColor: boolean;
};

type CommandContext = {
  argv: string[];
  globals: GlobalOptions;
};

type OpenOptions = GlobalOptions & {
  filePath: string;
  host: string;
  port: number;
  openBrowser: boolean;
  background: boolean;
};

type InitOptions = GlobalOptions & {
  filePath: string;
};

type ValidateOptions = GlobalOptions & {
  filePaths: string[];
  styleId?: string;
};

type RepairOptions = GlobalOptions & {
  filePath: string;
  styleId?: string;
  write: boolean;
};

type QualityOptions = GlobalOptions & {
  filePaths: string[];
  styleId?: string;
};

type ExportOptions = GlobalOptions & {
  filePath: string;
  outputPath?: string;
  renderFormat: RenderFormat;
  scale: number;
};

type ImportSvgOptions = GlobalOptions & {
  svgPath: string;
  outputPath?: string;
  title?: string;
  styleId?: string;
};

type ImportMermaidOptions = GlobalOptions & {
  mermaidPath: string;
  outputPath?: string;
  title?: string;
  styleId?: string;
};

type GalleryOptions = GlobalOptions & {
  outputPath?: string;
  openBrowser: boolean;
};

type DoctorOptions = GlobalOptions;

type ValidateStyleOptions = GlobalOptions & {
  styleIds: string[];
};

type SchemaOptions = GlobalOptions & {
  commandPath: string[];
};

type GuideOptions = GlobalOptions & {
  topic: string;
  detail?: string;
};

type ValidationSummary = {
  filePath: string;
  ok: boolean;
  errorCount: number;
  warningCount: number;
  issues: Array<SceneValidationIssue | DesignContractIssue>;
};

type StyleValidationSummary = {
  styleId: string;
  ok: boolean;
  errorCount: number;
  warningCount: number;
  issues: DesignContractIssue[];
};

type QualityDimensionId =
  | "task_fit"
  | "structure"
  | "visual_design"
  | "readability"
  | "connector_quality"
  | "validation_editability";

type QualityDimensionScore = {
  id: QualityDimensionId;
  name: string;
  score: 1 | 2 | 3 | 4;
  maxScore: 4;
  basis: string;
  issues: string[];
  needsReview?: boolean;
};

type QualitySummary = {
  filePath: string;
  ok: boolean;
  verdict: "pass" | "revise" | "fail";
  score: number;
  maxScore: 24;
  minDimensionScore: number;
  dimensions: QualityDimensionScore[];
  validation: {
    errorCount: number;
    warningCount: number;
    issues: Array<SceneValidationIssue | DesignContractIssue>;
  };
};

type AgentDrawErrorPayload = {
  error: string;
  message: string;
  suggestion: string;
  retryable: boolean;
  input?: unknown;
};

class CliError extends Error {
  readonly code: string;
  readonly exitCode: number;
  readonly suggestion: string;
  readonly retryable: boolean;
  readonly input?: unknown;

  constructor(
    code: string,
    message: string,
    options: {
      exitCode?: number;
      suggestion: string;
      retryable?: boolean;
      input?: unknown;
    },
  ) {
    super(message);
    this.name = "CliError";
    this.code = code;
    this.exitCode = options.exitCode ?? EXIT_GENERAL_ERROR;
    this.suggestion = options.suggestion;
    this.retryable = options.retryable ?? false;
    this.input = options.input;
  }
}

const main = async () => {
  const context = parseGlobalOptions(process.argv.slice(2));
  const [command = "help", ...args] = context.argv;

  if (command === "-h" || command === "--help" || command === "help") {
    printHelp(args[0], context.globals);
    return;
  }

  if (command === "-v" || command === "--version" || command === "version") {
    writeOutput({ version: VERSION }, `agentdraw ${VERSION}`, context.globals);
    return;
  }

  if (args.includes("-h") || args.includes("--help")) {
    printHelp(command, context.globals);
    return;
  }

  switch (command) {
    case "open":
      await openCommand(parseOpenOptions(args, context.globals));
      return;
    case "init":
      await initCommand(parseInitOptions(args, context.globals));
      return;
    case "validate":
      await validateCommand(parseValidateOptions(args, context.globals));
      return;
    case "repair":
      await repairCommand(parseRepairOptions(args, context.globals));
      return;
    case "quality":
      await qualityCommand(parseQualityOptions(args, context.globals));
      return;
    case "export":
      await exportCommand(parseExportOptions(args, context.globals));
      return;
    case "import-svg":
      await importSvgCommand(parseImportSvgOptions(args, context.globals));
      return;
    case "import-mermaid":
      await importMermaidCommand(parseImportMermaidOptions(args, context.globals));
      return;
    case "gallery":
      await galleryCommand(parseGalleryOptions(args, context.globals));
      return;
    case "validate-style":
      await validateStyleCommand(parseValidateStyleOptions(args, context.globals));
      return;
    case "doctor":
      await doctorCommand(parseDoctorOptions(args, context.globals));
      return;
    case "guide":
      await guideCommand(parseGuideOptions(args, context.globals));
      return;
    case "schema":
      await schemaCommand(parseSchemaOptions(args, context.globals));
      return;
    default:
      throw new CliError("unknown_command", `Unknown command: ${command}`, {
        exitCode: EXIT_USAGE_ERROR,
        suggestion: "Run: agentdraw --help",
        input: { command },
      });
  }
};

const openCommand = async (options: OpenOptions) => {
  const filePath = resolveScenePath(options.filePath, options.cwd);
  await readOrCreateSceneFile(filePath);

  if (options.background) {
    await openBackgroundCommand(options, filePath);
    return;
  }

  const server = await startAgentDrawServer({
    host: options.host,
    port: options.port,
    cwd: options.cwd,
  });
  const url = `${server.url}/?file=${encodeURIComponent(filePath)}`;

  writeOutput(
    {
      ok: true,
      command: "open",
      filePath,
      url,
      host: server.host,
      port: server.port,
      browserOpened: options.openBrowser,
      message: "AgentDraw server is running. Press Ctrl+C to stop it.",
    },
    [
      `AgentDraw ${VERSION}`,
      `File: ${filePath}`,
      `URL: ${url}`,
      "Press Ctrl+C to stop the server.",
    ].join("\n"),
    options,
  );

  if (options.openBrowser) {
    openSystemBrowser(url);
  }

  await waitForShutdown(server.close);
};

const initCommand = async (options: InitOptions) => {
  const filePath = resolveScenePath(options.filePath, options.cwd);
  const scene = await readOrCreateSceneFile(filePath);
  writeOutput(
    {
      ok: true,
      command: "init",
      filePath,
      sceneId: scene.id,
      title: scene.title,
      createdOrExists: true,
    },
    `Initialized AgentDraw scene: ${filePath}`,
    options,
  );
};

const validateCommand = async (options: ValidateOptions) => {
  if (options.filePaths.length === 0) {
    throw new CliError("missing_argument", "Scene file path is required.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw validate <file...>",
    });
  }

  const results: ValidationSummary[] = [];
  for (const inputPath of options.filePaths) {
    const filePath = resolveScenePath(inputPath, options.cwd);
    const scene = await readSceneFile(filePath);
    const validation = validateSceneWithContract(scene, options.styleId);
    results.push({
      filePath,
      ok: validation.errorCount === 0,
      errorCount: validation.errorCount,
      warningCount: validation.warningCount,
      issues: validation.issues,
    });
  }

  const errorCount = results.reduce((sum, result) => sum + result.errorCount, 0);
  const warningCount = results.reduce((sum, result) => sum + result.warningCount, 0);
  const payload = {
    ok: errorCount === 0,
    command: "validate",
    fileCount: results.length,
    errorCount,
    warningCount,
    results,
  };

  writeOutput(payload, formatValidationText(results, errorCount, warningCount), options);

  if (errorCount > 0) {
    process.exitCode = EXIT_GENERAL_ERROR;
  }
};

const repairCommand = async (options: RepairOptions) => {
  const filePath = resolveScenePath(options.filePath, options.cwd);
  const scene = await readSceneFile(filePath);
  const contract = getDesignContract(options.styleId ?? scene.styleId ?? "system-formal");
  const beforeValidation = validateSceneWithContract(scene, options.styleId);
  const repaired = repairScene(scene, {
    fontFamily: excalidrawFontFamily(contract.typography.fontFamily),
    connectorColor: contract.palette.muted,
    connectorStrokeWidth: contract.connectors.minStrokeWidth,
    addOuterFrame: contract.formality === "high",
    frameColor: contract.palette.muted,
    maxCornerRadiusPx: contract.geometry.cornerRadiusPx[1],
    allowedColors: contract.allowedColors,
  });
  const afterValidation = validateSceneWithContract(repaired.scene, options.styleId);
  const skippedWrite = options.write && isValidationWorse(afterValidation, beforeValidation);
  const wroteChanges = options.write && !skippedWrite;
  const validation = skippedWrite ? beforeValidation : afterValidation;

  if (wroteChanges) {
    await writeSceneFile(filePath, repaired.scene);
  }

  writeOutput(
    {
      ok: validation.errorCount === 0,
      command: "repair",
      filePath,
      styleId: contract.id,
      requestedWrite: options.write,
      written: wroteChanges,
      skippedWrite,
      changeCount: repaired.changes.length,
      changes: repaired.changes,
      beforeValidation: {
        errorCount: beforeValidation.errorCount,
        warningCount: beforeValidation.warningCount,
      },
      afterValidation: {
        errorCount: afterValidation.errorCount,
        warningCount: afterValidation.warningCount,
        issues: afterValidation.issues,
      },
      validation: {
        errorCount: validation.errorCount,
        warningCount: validation.warningCount,
        issues: validation.issues,
      },
    },
    formatRepairText(filePath, wroteChanges, skippedWrite, repaired.changes.length, validation),
    options,
  );

  if (validation.errorCount > 0) {
    process.exitCode = EXIT_GENERAL_ERROR;
  }
};

const qualityCommand = async (options: QualityOptions) => {
  if (options.filePaths.length === 0) {
    throw new CliError("missing_argument", "Scene file path is required.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw quality <file...>",
    });
  }

  const results: QualitySummary[] = [];
  for (const inputPath of options.filePaths) {
    const filePath = resolveScenePath(inputPath, options.cwd);
    const scene = await readSceneFile(filePath);
    const validation = validateSceneWithContract(scene, options.styleId);
    results.push(scoreSceneQuality(filePath, scene, validation));
  }

  const payload = {
    ok: results.every((result) => result.ok),
    command: "quality",
    fileCount: results.length,
    passCount: results.filter((result) => result.verdict === "pass").length,
    reviseCount: results.filter((result) => result.verdict === "revise").length,
    failCount: results.filter((result) => result.verdict === "fail").length,
    results,
  };

  writeOutput(payload, formatQualityText(results), options);

  if (!payload.ok) {
    process.exitCode = EXIT_GENERAL_ERROR;
  }
};

const exportCommand = async (options: ExportOptions) => {
  const filePath = resolveScenePath(options.filePath, options.cwd);
  const scene = await readSceneFile(filePath);
  const outputPath = resolveExportPath(
    options.outputPath,
    filePath,
    options.renderFormat,
    options.cwd,
  );
  const data =
    options.renderFormat === "png"
      ? renderScenePng(scene, { scale: options.scale })
      : renderSceneSvg(scene, { scale: options.scale });
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, data);

  writeOutput(
    {
      ok: true,
      command: "export",
      filePath,
      outputPath,
      format: options.renderFormat,
      scale: options.scale,
      message: `Exported ${options.renderFormat.toUpperCase()} preview.`,
    },
    `Exported ${options.renderFormat.toUpperCase()}: ${outputPath}`,
    options,
  );
};

const importSvgCommand = async (options: ImportSvgOptions) => {
  const svgPath = path.isAbsolute(options.svgPath)
    ? options.svgPath
    : path.resolve(options.cwd, options.svgPath);
  const outputPath = options.outputPath
    ? path.isAbsolute(options.outputPath)
      ? options.outputPath
      : path.resolve(options.cwd, options.outputPath)
    : defaultImportedScenePath(svgPath);
  const svg = readFileSync(svgPath, "utf8");
  const result = importSvgToAgentDrawScene(svg, {
    title: options.title,
    styleId: options.styleId,
  });
  await writeSceneFile(outputPath, result.scene);
  const validation = validateSceneWithContract(result.scene, options.styleId);

  writeOutput(
    {
      ok: true,
      command: "import-svg",
      svgPath,
      outputPath,
      styleId: result.scene.styleId,
      elementCount: result.scene.elements.length,
      warningCount: result.warnings.length,
      warnings: result.warnings,
      validationOk: validation.errorCount === 0,
      validation,
    },
    [
      `Imported SVG into AgentDraw scene: ${outputPath}`,
      `Elements: ${result.scene.elements.length}`,
      result.warnings.length ? `Warnings: ${result.warnings.length}` : "Warnings: 0",
      `Validation: ${validation.errorCount} error(s), ${validation.warningCount} warning(s)`,
    ].join("\n"),
    options,
  );
};

const importMermaidCommand = async (options: ImportMermaidOptions) => {
  const mermaidPath = path.isAbsolute(options.mermaidPath)
    ? options.mermaidPath
    : path.resolve(options.cwd, options.mermaidPath);
  const outputPath = options.outputPath
    ? path.isAbsolute(options.outputPath)
      ? options.outputPath
      : path.resolve(options.cwd, options.outputPath)
    : defaultImportedScenePath(mermaidPath);
  const source = readFileSync(mermaidPath, "utf8");
  const parsed = parseMermaidFlowchart(source);
  const scene = mermaidFlowchartToScene(parsed, {
    title: options.title ?? path.basename(mermaidPath, path.extname(mermaidPath)),
    styleId: options.styleId ?? "system-formal",
  });
  const contract = getDesignContract(scene.styleId ?? "system-formal");
  const repaired = repairScene(scene, {
    fontFamily: excalidrawFontFamily(contract.typography.fontFamily),
    connectorColor: contract.palette.muted,
    connectorStrokeWidth: contract.connectors.minStrokeWidth,
    addOuterFrame: false,
    frameColor: contract.palette.muted,
    maxCornerRadiusPx: contract.geometry.cornerRadiusPx[1],
    allowedColors: contract.allowedColors,
  });
  await writeSceneFile(outputPath, repaired.scene);
  const validation = validateSceneWithContract(repaired.scene, options.styleId);

  writeOutput(
    {
      ok: true,
      command: "import-mermaid",
      mermaidPath,
      outputPath,
      styleId: repaired.scene.styleId,
      nodeCount: parsed.nodes.length,
      edgeCount: parsed.edges.length,
      elementCount: repaired.scene.elements.length,
      repairedChangeCount: repaired.changes.length,
      validationOk: validation.errorCount === 0,
      validation,
    },
    [
      `Imported Mermaid flowchart into AgentDraw scene: ${outputPath}`,
      `Nodes: ${parsed.nodes.length}`,
      `Edges: ${parsed.edges.length}`,
      `Elements: ${repaired.scene.elements.length}`,
      `Validation: ${validation.errorCount} error(s), ${validation.warningCount} warning(s)`,
    ].join("\n"),
    options,
  );
};

const galleryCommand = async (options: GalleryOptions) => {
  const outputPath = options.outputPath
    ? path.resolve(options.cwd, options.outputPath)
    : path.resolve(options.cwd, ".agentdraw/theme-gallery.html");
  const previewAssetDir = path.resolve(path.dirname(outputPath), "theme-gallery-assets");
  await mkdir(path.dirname(outputPath), { recursive: true });
  await mkdir(previewAssetDir, { recursive: true });
  const previewAssets = await writeThemeGalleryAssets(previewAssetDir);
  await writeFile(outputPath, themeGalleryHtml(), "utf8");
  const url = pathToFileURL(outputPath).toString();

  if (options.openBrowser) {
    openSystemBrowser(url);
  }

  writeOutput(
    {
      ok: true,
      command: "gallery",
      outputPath,
      url,
      browserOpened: options.openBrowser,
      styleCount: styles.length,
      previewAssetDir,
      styles: styles.map((style) => galleryStyleSummary(style, previewAssets.get(style.id))),
    },
    [`Theme gallery: ${outputPath}`, `URL: ${url}`].join("\n"),
    options,
  );
};

const validateStyleCommand = async (options: ValidateStyleOptions) => {
  const styleIds = options.styleIds.length > 0 ? options.styleIds : styles.map((style) => style.id);
  const results: StyleValidationSummary[] = [];

  for (const styleId of styleIds) {
    const style = styles.find((candidate) => candidate.id === styleId);
    if (!style) {
      throw new CliError("unknown_style", `Unknown style id: ${styleId}`, {
        exitCode: EXIT_USAGE_ERROR,
        suggestion: "Run: agentdraw guide styles --json",
        input: { styleId },
      });
    }
    const issues = validateDesignGuide(style, readDesignMarkdown(style.id));
    results.push({
      styleId,
      ok: issues.every((issue) => issue.severity !== "error"),
      errorCount: issues.filter((issue) => issue.severity === "error").length,
      warningCount: issues.filter((issue) => issue.severity === "warning").length,
      issues,
    });
  }

  const errorCount = results.reduce((sum, result) => sum + result.errorCount, 0);
  const warningCount = results.reduce((sum, result) => sum + result.warningCount, 0);
  const payload = {
    ok: errorCount === 0,
    command: "validate-style",
    styleCount: results.length,
    errorCount,
    warningCount,
    results,
  };
  writeOutput(payload, formatStyleValidationText(results, errorCount, warningCount), options);

  if (errorCount > 0) {
    process.exitCode = EXIT_GENERAL_ERROR;
  }
};

const doctorCommand = async (options: DoctorOptions) => {
  const checks = [
    {
      name: "node_version",
      ok: Number(process.versions.node.split(".")[0]) >= 20,
      value: process.versions.node,
      suggestion: "Use Node.js 20 or newer.",
    },
    {
      name: "platform",
      ok: true,
      value: `${process.platform}/${process.arch}`,
      suggestion: "",
    },
    {
      name: "cwd",
      ok: true,
      value: options.cwd,
      suggestion: "",
    },
    {
      name: "browser_open_command",
      ok: true,
      value: browserCommand().command,
      suggestion: "Use --no-open on remote hosts or WSL when no GUI browser is available.",
    },
  ];
  const payload = {
    ok: checks.every((check) => check.ok),
    command: "doctor",
    version: VERSION,
    checks,
  };
  writeOutput(payload, formatDoctorText(payload), options);

  if (!payload.ok) {
    process.exitCode = EXIT_GENERAL_ERROR;
  }
};

const schemaCommand = async (options: SchemaOptions) => {
  const schema = commandSchema(options.commandPath);
  writeOutput(schema, formatSchemaText(schema), options);
};

const guideCommand = async (options: GuideOptions) => {
  const payload = guidePayload(options.topic, options.detail);
  writeOutput(payload, formatGuideText(options.topic, options.detail), options);
};

const parseGlobalOptions = (argv: string[]): CommandContext => {
  const globals: GlobalOptions = {
    cwd: process.env.INIT_CWD ?? process.cwd(),
    noColor: Boolean(process.env.NO_COLOR) || process.env.TERM === "dumb",
  };
  const rest: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") {
      rest.push(...argv.slice(index + 1));
      break;
    }
    if (arg === "--json") {
      globals.format = "json";
      continue;
    }
    if (arg === "--format") {
      const value = argv[index + 1];
      if (value === "json" || value === "text") {
        globals.format = readFormat(value, "--format");
        index += 1;
        continue;
      }
      rest.push(arg);
      if (value !== undefined) {
        rest.push(value);
        index += 1;
      }
      continue;
    }
    if (arg.startsWith("--format=")) {
      const value = arg.slice("--format=".length);
      if (value === "json" || value === "text") {
        globals.format = readFormat(value, "--format");
      } else {
        rest.push(arg);
      }
      continue;
    }
    if (arg === "--cwd") {
      globals.cwd = readCwd(argv[++index]);
      continue;
    }
    if (arg.startsWith("--cwd=")) {
      globals.cwd = readCwd(arg.slice("--cwd=".length));
      continue;
    }
    if (arg === "--no-color") {
      globals.noColor = true;
      continue;
    }
    rest.push(arg);
  }

  return { argv: rest, globals };
};

const parseOpenOptions = (args: string[], globals: GlobalOptions): OpenOptions => {
  const values = parseCommandFlags(args, {
    booleanFlags: ["--no-open", "--open", "--background", "--detach"],
    valueFlags: ["--host", "--port"],
  });
  assertNoUnknownFlags(values.unknownFlags, "open");
  if (values.positionals.length > 1) {
    throw new CliError("too_many_arguments", "The open command accepts at most one file.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw open [file] --help",
      input: { args },
    });
  }
  return {
    ...globals,
    filePath: values.positionals[0] ?? DEFAULT_SCENE,
    host: values.valueFlags["--host"] ?? DEFAULT_HOST,
    port: readPort(values.valueFlags["--port"] ?? String(DEFAULT_PORT)),
    openBrowser: values.booleanFlags.has("--no-open")
      ? false
      : values.booleanFlags.has("--open")
        ? true
        : process.stdout.isTTY,
    background: values.booleanFlags.has("--background") || values.booleanFlags.has("--detach"),
  };
};

const parseInitOptions = (args: string[], globals: GlobalOptions): InitOptions => {
  const values = parseCommandFlags(args, { booleanFlags: [], valueFlags: [] });
  assertNoUnknownFlags(values.unknownFlags, "init");
  if (values.positionals.length > 1) {
    throw new CliError("too_many_arguments", "The init command accepts at most one file.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw init [file] --help",
      input: { args },
    });
  }
  return {
    ...globals,
    filePath: values.positionals[0] ?? DEFAULT_SCENE,
  };
};

const parseValidateOptions = (
  args: string[],
  globals: GlobalOptions,
): ValidateOptions => {
  const values = parseCommandFlags(args, { booleanFlags: [], valueFlags: ["--style"] });
  assertNoUnknownFlags(values.unknownFlags, "validate");
  return {
    ...globals,
    filePaths: values.positionals,
    styleId: values.valueFlags["--style"],
  };
};

const parseRepairOptions = (args: string[], globals: GlobalOptions): RepairOptions => {
  const values = parseCommandFlags(args, {
    booleanFlags: ["--write", "--dry-run"],
    valueFlags: ["--style"],
  });
  assertNoUnknownFlags(values.unknownFlags, "repair");
  if (values.positionals.length !== 1) {
    throw new CliError("missing_argument", "The repair command requires one scene file.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw repair <file> --write",
      input: { args },
    });
  }
  return {
    ...globals,
    filePath: values.positionals[0],
    styleId: values.valueFlags["--style"],
    write: values.booleanFlags.has("--dry-run") ? false : values.booleanFlags.has("--write"),
  };
};

const parseQualityOptions = (
  args: string[],
  globals: GlobalOptions,
): QualityOptions => {
  const values = parseCommandFlags(args, { booleanFlags: [], valueFlags: ["--style"] });
  assertNoUnknownFlags(values.unknownFlags, "quality");
  return {
    ...globals,
    filePaths: values.positionals,
    styleId: values.valueFlags["--style"],
  };
};

const parseExportOptions = (args: string[], globals: GlobalOptions): ExportOptions => {
  const values = parseCommandFlags(args, {
    booleanFlags: [],
    valueFlags: ["--format", "--out", "--output", "--scale"],
  });
  assertNoUnknownFlags(values.unknownFlags, "export");
  if (values.positionals.length !== 1) {
    throw new CliError("missing_argument", "The export command requires one scene file.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw export <file> --format svg|png --out <preview>",
      input: { args },
    });
  }
  const outputPath = values.valueFlags["--out"] ?? values.valueFlags["--output"];
  return {
    ...globals,
    filePath: values.positionals[0],
    outputPath,
    renderFormat: readRenderFormat(values.valueFlags["--format"], outputPath),
    scale: readScale(values.valueFlags["--scale"] ?? "1"),
  };
};

const parseImportSvgOptions = (args: string[], globals: GlobalOptions): ImportSvgOptions => {
  const values = parseCommandFlags(args, {
    booleanFlags: [],
    valueFlags: ["--out", "--output", "--title", "--style"],
  });
  assertNoUnknownFlags(values.unknownFlags, "import-svg");
  if (values.positionals.length !== 1) {
    throw new CliError("missing_argument", "The import-svg command requires one SVG file.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw import-svg <file.svg> --out <board.agentdraw.json>",
      input: { args },
    });
  }
  return {
    ...globals,
    svgPath: values.positionals[0],
    outputPath: values.valueFlags["--out"] ?? values.valueFlags["--output"],
    title: values.valueFlags["--title"],
    styleId: values.valueFlags["--style"],
  };
};

const parseImportMermaidOptions = (
  args: string[],
  globals: GlobalOptions,
): ImportMermaidOptions => {
  const values = parseCommandFlags(args, {
    booleanFlags: [],
    valueFlags: ["--out", "--output", "--title", "--style"],
  });
  assertNoUnknownFlags(values.unknownFlags, "import-mermaid");
  if (values.positionals.length !== 1) {
    throw new CliError("missing_argument", "The import-mermaid command requires one Mermaid file.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw import-mermaid <file.mmd> --out <board.agentdraw.json>",
      input: { args },
    });
  }
  return {
    ...globals,
    mermaidPath: values.positionals[0],
    outputPath: values.valueFlags["--out"] ?? values.valueFlags["--output"],
    title: values.valueFlags["--title"],
    styleId: values.valueFlags["--style"],
  };
};

const parseGalleryOptions = (args: string[], globals: GlobalOptions): GalleryOptions => {
  const values = parseCommandFlags(args, {
    booleanFlags: ["--open", "--no-open"],
    valueFlags: ["--out", "--output"],
  });
  assertNoUnknownFlags(values.unknownFlags, "gallery");
  if (values.positionals.length > 1) {
    throw new CliError("too_many_arguments", "The gallery command accepts at most one output path.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw gallery [output.html] --open",
      input: { args },
    });
  }
  return {
    ...globals,
    outputPath: values.valueFlags["--out"] ?? values.valueFlags["--output"] ?? values.positionals[0],
    openBrowser: values.booleanFlags.has("--no-open")
      ? false
      : values.booleanFlags.has("--open")
        ? true
        : process.stdout.isTTY,
  };
};

const parseValidateStyleOptions = (
  args: string[],
  globals: GlobalOptions,
): ValidateStyleOptions => {
  const values = parseCommandFlags(args, { booleanFlags: [], valueFlags: [] });
  assertNoUnknownFlags(values.unknownFlags, "validate-style");
  return {
    ...globals,
    styleIds: values.positionals,
  };
};

const parseDoctorOptions = (args: string[], globals: GlobalOptions): DoctorOptions => {
  const values = parseCommandFlags(args, { booleanFlags: [], valueFlags: [] });
  assertNoUnknownFlags(values.unknownFlags, "doctor");
  if (values.positionals.length > 0) {
    throw new CliError("too_many_arguments", "The doctor command does not accept files.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw doctor --help",
      input: { args },
    });
  }
  return globals;
};

const parseGuideOptions = (args: string[], globals: GlobalOptions): GuideOptions => {
  const values = parseCommandFlags(args, { booleanFlags: [], valueFlags: [] });
  assertNoUnknownFlags(values.unknownFlags, "guide");
  if (values.positionals.length > 2) {
    throw new CliError("too_many_arguments", "The guide command accepts at most two arguments.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw help guide",
      input: { args },
    });
  }
  return {
    ...globals,
    topic: values.positionals[0] ?? "workflow",
    detail: values.positionals[1],
  };
};

const parseSchemaOptions = (args: string[], globals: GlobalOptions): SchemaOptions => {
  const values = parseCommandFlags(args, { booleanFlags: [], valueFlags: [] });
  assertNoUnknownFlags(values.unknownFlags, "schema");
  return {
    ...globals,
    commandPath: values.positionals,
  };
};

const parseCommandFlags = (
  args: string[],
  config: { booleanFlags: string[]; valueFlags: string[] },
) => {
  const booleanFlags = new Set<string>();
  const valueFlags: Record<string, string> = {};
  const positionals: string[] = [];
  const unknownFlags: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("-")) {
      positionals.push(arg);
      continue;
    }

    const [flag, inlineValue] = arg.split("=", 2);
    if (config.booleanFlags.includes(flag)) {
      if (inlineValue !== undefined) {
        unknownFlags.push(arg);
        continue;
      }
      booleanFlags.add(flag);
      continue;
    }
    if (config.valueFlags.includes(flag)) {
      const value = inlineValue ?? args[++index];
      if (!value || value.startsWith("-")) {
        throw new CliError("missing_flag_value", `Missing value for ${flag}.`, {
          exitCode: EXIT_USAGE_ERROR,
          suggestion: `Run: agentdraw help ${inferCommandFromFlags(config)}`,
          input: { flag },
        });
      }
      valueFlags[flag] = value;
      continue;
    }
    unknownFlags.push(flag);
  }

  return { booleanFlags, valueFlags, positionals, unknownFlags };
};

const assertNoUnknownFlags = (flags: string[], command: string) => {
  if (flags.length === 0) {
    return;
  }
  throw new CliError("unknown_flag", `Unknown flag: ${flags.join(", ")}`, {
    exitCode: EXIT_USAGE_ERROR,
    suggestion: `Run: agentdraw help ${command}`,
    input: { flags },
  });
};

const readFormat = (value: string | undefined, flag: string): OutputFormat => {
  if (value === "json" || value === "text") {
    return value;
  }
  throw new CliError("invalid_format", `${flag} must be json or text.`, {
    exitCode: EXIT_USAGE_ERROR,
    suggestion: "Use --format json or --format text.",
    input: { value },
  });
};

const readCwd = (value: string | undefined) => {
  if (!value) {
    throw new CliError("missing_flag_value", "Missing value for --cwd.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Use --cwd <directory>.",
      input: { flag: "--cwd" },
    });
  }
  return path.resolve(value);
};

const readPort = (value: string) => {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new CliError("invalid_port", "--port must be an integer from 1 to 65535.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: `Use --port ${DEFAULT_PORT} or another free TCP port.`,
      input: { port: value },
    });
  }
  return port;
};

const readRenderFormat = (value: string | undefined, outputPath: string | undefined): RenderFormat => {
  const inferred = outputPath?.toLowerCase().endsWith(".png")
    ? "png"
    : outputPath?.toLowerCase().endsWith(".svg")
      ? "svg"
      : undefined;
  const format = value ?? inferred ?? "svg";
  if (format === "svg" || format === "png") {
    return format;
  }
  throw new CliError("invalid_format", "--format must be svg or png.", {
    exitCode: EXIT_USAGE_ERROR,
    suggestion: "Use --format svg or --format png.",
    input: { value },
  });
};

const readScale = (value: string) => {
  const scale = Number(value);
  if (!Number.isFinite(scale) || scale <= 0 || scale > 4) {
    throw new CliError("invalid_scale", "--scale must be greater than 0 and at most 4.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Use --scale 1, --scale 2, or another value up to 4.",
      input: { value },
    });
  }
  return scale;
};

const resolveScenePath = (inputPath: string, cwd: string) => {
  const filePath = normalizeScenePath(inputPath, cwd);
  assertSafePath(filePath);
  return filePath;
};

const resolveExportPath = (
  outputPath: string | undefined,
  filePath: string,
  format: RenderFormat,
  cwd: string,
) => {
  if (outputPath) {
    return path.isAbsolute(outputPath) ? outputPath : path.resolve(cwd, outputPath);
  }
  const parsed = path.parse(filePath);
  return path.join(parsed.dir, `${parsed.name}.${format}`);
};

const defaultImportedScenePath = (svgPath: string) => {
  const parsed = path.parse(svgPath);
  return path.join(parsed.dir, `${parsed.name}.agentdraw.json`);
};

type MermaidNodeShape = "rectangle" | "rounded" | "terminal" | "diamond" | "ellipse";

type MermaidNode = {
  id: string;
  label: string;
  shape: MermaidNodeShape;
};

type MermaidEdge = {
  from: string;
  to: string;
  label?: string;
  arrow: boolean;
};

type MermaidFlowchart = {
  direction: "TD" | "LR";
  nodes: MermaidNode[];
  edges: MermaidEdge[];
};

type MermaidLayoutNode = MermaidNode & {
  x: number;
  y: number;
  width: number;
  height: number;
  layer: number;
};

type MermaidSceneOptions = {
  title: string;
  styleId: string;
};

const parseMermaidFlowchart = (source: string): MermaidFlowchart => {
  const lines = source
    .split(/\r?\n/)
    .map((line) => line.replace(/%%.*$/, "").trim())
    .filter(Boolean);
  const header = lines.shift();
  const headerMatch = header?.match(/^(flowchart|graph)\s+(TD|TB|BT|LR|RL)$/i);
  if (!headerMatch) {
    throw new CliError("unsupported_mermaid", "Only Mermaid flowchart/graph diagrams are supported.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Start the file with: flowchart TD",
      input: { firstLine: header ?? "" },
    });
  }

  const direction = headerMatch[2].toUpperCase();
  if (direction === "BT" || direction === "RL") {
    throw new CliError("unsupported_mermaid_direction", `Unsupported Mermaid direction: ${direction}`, {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Use TD/TB for vertical diagrams or LR for horizontal diagrams.",
      input: { direction },
    });
  }

  const nodes = new Map<string, MermaidNode>();
  const edges: MermaidEdge[] = [];

  for (const rawLine of lines) {
    const line = rawLine.replace(/;$/, "").trim();
    if (!line || line.startsWith("subgraph ") || line === "end") {
      continue;
    }
    const edge = parseMermaidEdge(line);
    if (edge) {
      registerMermaidNode(nodes, edge.fromNode);
      registerMermaidNode(nodes, edge.toNode);
      edges.push({
        from: edge.fromNode.id,
        to: edge.toNode.id,
        label: edge.label,
        arrow: edge.arrow,
      });
      continue;
    }
    const node = parseMermaidNode(line);
    if (node) {
      registerMermaidNode(nodes, node);
      continue;
    }
    throw new CliError("unsupported_mermaid_line", "Unsupported Mermaid flowchart line.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Use simple node declarations and edges such as A[Label] --> B{Decision}.",
      input: { line },
    });
  }

  if (nodes.size === 0) {
    throw new CliError("empty_mermaid", "The Mermaid file did not contain any flowchart nodes.", {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Add at least one node or edge, for example: A[Start] --> B[Done].",
    });
  }

  return {
    direction: direction === "LR" ? "LR" : "TD",
    nodes: [...nodes.values()],
    edges,
  };
};

const parseMermaidEdge = (line: string) => {
  const operators = ["-->", "---", "-.->", "==>"];
  for (const operator of operators) {
    const parts = line.split(operator);
    if (parts.length !== 2) continue;
    const left = parts[0].trim();
    let right = parts[1].trim();
    let label: string | undefined;
    const labelMatch = right.match(/^\|([^|]+)\|\s*(.+)$/);
    if (labelMatch) {
      label = cleanMermaidLabel(labelMatch[1]);
      right = labelMatch[2].trim();
    }
    const fromNode = parseMermaidNode(left);
    const toNode = parseMermaidNode(right);
    if (!fromNode || !toNode) return null;
    return {
      fromNode,
      toNode,
      label,
      arrow: operator !== "---",
    };
  }
  return null;
};

const parseMermaidNode = (raw: string): MermaidNode | null => {
  const input = raw.trim();
  if (!input) return null;
  const parsed = parseMermaidShapedNode(input, "diamond", /^\s*([A-Za-z0-9_:-]+)\s*\{(.+)\}\s*$/);
  if (parsed) return parsed;
  const ellipse = parseMermaidShapedNode(input, "ellipse", /^\s*([A-Za-z0-9_:-]+)\s*\(\((.+)\)\)\s*$/);
  if (ellipse) return ellipse;
  const terminal = parseMermaidShapedNode(input, "terminal", /^\s*([A-Za-z0-9_:-]+)\s*\(\[(.+)\]\)\s*$/);
  if (terminal) return terminal;
  const rounded = parseMermaidShapedNode(input, "rounded", /^\s*([A-Za-z0-9_:-]+)\s*\((.+)\)\s*$/);
  if (rounded) return rounded;
  const rectangle = parseMermaidShapedNode(input, "rectangle", /^\s*([A-Za-z0-9_:-]+)\s*\[(.+)\]\s*$/);
  if (rectangle) return rectangle;
  const bare = input.match(/^\s*([A-Za-z0-9_:-]+)\s*$/);
  return bare ? { id: bare[1], label: bare[1], shape: "rectangle" } : null;
};

const parseMermaidShapedNode = (
  input: string,
  shape: MermaidNodeShape,
  pattern: RegExp,
): MermaidNode | null => {
  const match = input.match(pattern);
  if (!match) return null;
  return { id: match[1], label: cleanMermaidLabel(match[2]), shape };
};

const cleanMermaidLabel = (value: string) =>
  value.trim().replace(/^["']|["']$/g, "").replace(/<br\s*\/?>/gi, "\n");

const registerMermaidNode = (nodes: Map<string, MermaidNode>, node: MermaidNode) => {
  const existing = nodes.get(node.id);
  if (!existing || existing.label === existing.id) {
    nodes.set(node.id, node);
  }
};

const mermaidNodeElementId = (nodeId: string) => `mermaid-node-${nodeId}`;

const addMermaidBoundElement = (
  boundElementsByNodeId: Map<string, Array<{ type: string; id: string }>>,
  nodeId: string,
  boundElement: { type: string; id: string },
) => {
  const boundElements = boundElementsByNodeId.get(nodeId) ?? [];
  boundElements.push(boundElement);
  boundElementsByNodeId.set(nodeId, boundElements);
};

const mermaidFlowchartToScene = (
  flowchart: MermaidFlowchart,
  options: MermaidSceneOptions,
): AgentDrawScene => {
  const style = styles.find((candidate) => candidate.id === options.styleId) ?? styles[0];
  const contract = getDesignContract(style);
  const layout = layoutMermaidNodes(flowchart);
  const seedStart = Date.now() % 100000;
  let seed = seedStart;
  const nextSeed = () => {
    seed += 1;
    return seed;
  };
  const elements: unknown[] = [];
  const boundElementsByNodeId = new Map<string, Array<{ type: string; id: string }>>();
  const bounds = layoutBounds(layout);
  const margin = 56;
  elements.push(
    shapeElement(`mermaid-frame-${nextSeed()}`, "rectangle", bounds.x - margin, bounds.y - margin, bounds.width + margin * 2, bounds.height + margin * 2, {
      seed: nextSeed(),
      strokeColor: contract.palette.muted,
      backgroundColor: "transparent",
      strokeWidth: 1,
      roughness: contract.geometry.roughness[0],
      roundness: contract.formality === "high" ? null : { type: 3 },
    }),
  );

  for (const edge of flowchart.edges) {
    const from = layout.find((node) => node.id === edge.from);
    const to = layout.find((node) => node.id === edge.to);
    if (!from || !to) continue;
    const connector = connectorBetween(from, to, flowchart.direction);
    const edgeId = `mermaid-edge-${edge.from}-${edge.to}-${nextSeed()}`;
    addMermaidBoundElement(boundElementsByNodeId, edge.from, { type: "arrow", id: edgeId });
    addMermaidBoundElement(boundElementsByNodeId, edge.to, { type: "arrow", id: edgeId });
    elements.push(
      connectorElement(edgeId, connector.x, connector.y, connector.points, {
        seed: nextSeed(),
        strokeColor: contract.palette.muted,
        strokeWidth: contract.connectors.minStrokeWidth,
        roughness: contract.geometry.roughness[0],
        arrow: edge.arrow,
        elbowed: connector.points.length > 2,
        startElementId: mermaidNodeElementId(edge.from),
        endElementId: mermaidNodeElementId(edge.to),
        startFixedPoint: bindingFixedPoint(from, connector.x, connector.y, connector.points[0]),
        endFixedPoint: bindingFixedPoint(
          to,
          connector.x,
          connector.y,
          connector.points[connector.points.length - 1],
        ),
      }),
    );
    if (edge.label) {
      const siblings = flowchart.edges.filter((candidate) => candidate.from === edge.from);
      const siblingIndex = siblings.findIndex((candidate) => candidate === edge);
      const labelPoint = connectorLabelPoint(connector, flowchart.direction, siblingIndex, siblings.length);
      elements.push(
        textElement(`mermaid-edge-label-${edge.from}-${edge.to}-${nextSeed()}`, labelPoint.x - 40, labelPoint.y - 10, 80, 20, edge.label, {
          seed: nextSeed(),
          fontSize: contract.typography.bodyPx[0],
          fontFamily: excalidrawFontFamily(contract.typography.fontFamily),
          strokeColor: contract.palette.muted,
          textAlign: "center",
          verticalAlign: "middle",
        }),
      );
    }
  }

  for (const node of layout) {
    const isDecision = node.shape === "diamond";
    const isTerminal = node.shape === "terminal" || node.shape === "ellipse";
    const fill = isDecision ? contract.palette.accent2 : isTerminal ? contract.palette.panel : "#FFFFFF";
    const nodeId = mermaidNodeElementId(node.id);
    const labelId = `mermaid-label-${node.id}`;
    const labelFontSize = contract.typography.bodyPx[1];
    const labelBox = centeredNodeLabelBox(node, node.label, labelFontSize);
    elements.push(
      shapeElement(nodeId, nodeShapeType(node), node.x, node.y, node.width, node.height, {
        seed: nextSeed(),
        strokeColor: contract.palette.ink,
        backgroundColor: fill,
        strokeWidth: Math.max(contract.geometry.strokeWidth[0], 2),
        roughness: contract.geometry.roughness[0],
        roundness: isDecision || isTerminal || contract.formality === "high" ? null : { type: 3 },
        customData: { mermaidId: node.id, mermaidShape: node.shape },
        boundTextId: labelId,
        boundElements: boundElementsByNodeId.get(node.id),
      }),
    );
    elements.push(
      textElement(labelId, labelBox.x, labelBox.y, labelBox.width, labelBox.height, node.label, {
        seed: nextSeed(),
        fontSize: labelFontSize,
        fontFamily: excalidrawFontFamily(contract.typography.fontFamily),
        strokeColor: contract.palette.ink,
        textAlign: "center",
        verticalAlign: "middle",
        containerId: nodeId,
      }),
    );
  }

  return {
    type: "agentdraw/scene",
    version: 1,
    id: randomUUID(),
    title: options.title,
    styleId: style.id,
    providerId: "excalidraw",
    updatedAt: new Date().toISOString(),
    elements,
    appState: {
      viewBackgroundColor: contract.palette.canvas,
      currentItemStrokeColor: contract.palette.ink,
      currentItemBackgroundColor: contract.palette.panel,
      currentItemFillStyle: "solid",
      currentItemStrokeWidth: Math.max(contract.geometry.strokeWidth[0], 2),
      currentItemStrokeStyle: "solid",
      currentItemRoughness: contract.geometry.roughness[0],
      currentItemFontFamily: excalidrawFontFamily(contract.typography.fontFamily),
      currentItemRoundness: contract.formality === "high" ? "sharp" : "round",
      currentItemArrowType: contract.connectors.preferred,
      currentItemStartArrowhead: null,
      currentItemEndArrowhead: "arrow",
      scrollX: 80,
      scrollY: 64,
      zoom: { value: 0.72 },
    },
    files: {},
  };
};

const layoutMermaidNodes = (flowchart: MermaidFlowchart): MermaidLayoutNode[] => {
  const byId = new Map(flowchart.nodes.map((node) => [node.id, node]));
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, number>();
  for (const node of flowchart.nodes) {
    outgoing.set(node.id, []);
    incoming.set(node.id, 0);
  }
  for (const edge of flowchart.edges) {
    if (!byId.has(edge.from) || !byId.has(edge.to)) continue;
    outgoing.get(edge.from)?.push(edge.to);
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
  }

  const roots = flowchart.nodes.filter((node) => (incoming.get(node.id) ?? 0) === 0);
  const queue = roots.length ? roots.map((node) => node.id) : [flowchart.nodes[0].id];
  const layers = new Map<string, number>();
  for (const id of queue) layers.set(id, 0);
  while (queue.length > 0) {
    const id = queue.shift()!;
    const layer = layers.get(id) ?? 0;
    for (const child of outgoing.get(id) ?? []) {
      const nextLayer = Math.max(layers.get(child) ?? 0, layer + 1);
      if (nextLayer !== layers.get(child)) {
        layers.set(child, nextLayer);
        queue.push(child);
      }
    }
  }
  for (const node of flowchart.nodes) {
    if (!layers.has(node.id)) layers.set(node.id, 0);
  }

  const groups = new Map<number, MermaidNode[]>();
  for (const node of flowchart.nodes) {
    const layer = layers.get(node.id) ?? 0;
    const group = groups.get(layer) ?? [];
    group.push(node);
    groups.set(layer, group);
  }

  const layerGap = flowchart.direction === "LR" ? 282 : 190;
  const rowGap = flowchart.direction === "LR" ? 154 : 248;
  const originX = 120;
  const originY = 130;
  const maxLayerSize = Math.max(...[...groups.values()].map((group) => group.length));

  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .flatMap(([layer, group]) => {
      const offset = ((maxLayerSize - group.length) * rowGap) / 2;
      return group.map((node, index) => {
        const size = mermaidNodeSize(node);
        return flowchart.direction === "LR"
          ? {
              ...node,
              ...size,
              layer,
              x: originX + layer * layerGap,
              y: originY + offset + index * rowGap,
            }
          : {
              ...node,
              ...size,
              layer,
              x: originX + offset + index * rowGap,
              y: originY + layer * layerGap,
            };
      });
    });
};

const mermaidNodeSize = (node: MermaidNode) => {
  const lines = node.label.split("\n");
  const longest = Math.max(...lines.map((line) => line.length), 4);
  const width = Math.max(node.shape === "diamond" ? 184 : 176, Math.min(280, longest * 11 + 56));
  const height = Math.max(node.shape === "diamond" ? 106 : 82, lines.length * 24 + 42);
  return { width, height };
};

const layoutBounds = (nodes: MermaidLayoutNode[]) => {
  const minX = Math.min(...nodes.map((node) => node.x));
  const minY = Math.min(...nodes.map((node) => node.y));
  const maxX = Math.max(...nodes.map((node) => node.x + node.width));
  const maxY = Math.max(...nodes.map((node) => node.y + node.height));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

const connectorBetween = (from: MermaidLayoutNode, to: MermaidLayoutNode, direction: "TD" | "LR") => {
  if (direction === "LR") {
    const startX = from.x + from.width;
    const startY = from.y + from.height / 2;
    const endX = to.x;
    const endY = to.y + to.height / 2;
    const midX = startX + Math.max(28, (endX - startX) / 2);
    return {
      x: startX,
      y: startY,
      points: [
        [0, 0],
        [midX - startX, 0],
        [midX - startX, endY - startY],
        [endX - startX, endY - startY],
      ],
    };
  }
  if (to.layer > from.layer + 1) {
    const startX = from.x + from.width;
    const startY = from.y + from.height / 2;
    const endX = to.x + to.width;
    const endY = to.y + to.height / 2;
    const detourX = Math.max(startX, endX) + 58;
    return {
      x: startX,
      y: startY,
      points: [
        [0, 0],
        [detourX - startX, 0],
        [detourX - startX, endY - startY],
        [endX - startX, endY - startY],
      ],
    };
  }
  const startX = from.x + from.width / 2;
  const startY = from.y + from.height;
  const endX = to.x + to.width / 2;
  const endY = to.y;
  const midY = startY + Math.max(28, (endY - startY) / 2);
  return {
    x: startX,
    y: startY,
    points: [
      [0, 0],
      [0, midY - startY],
      [endX - startX, midY - startY],
      [endX - startX, endY - startY],
    ],
  };
};

const connectorLabelPoint = (
  connector: { x: number; y: number; points: number[][] },
  direction: "TD" | "LR",
  siblingIndex = 0,
  siblingCount = 1,
) => {
  const branchOffset =
    siblingCount > 1 ? (siblingIndex - (siblingCount - 1) / 2) * 148 : 76;
  if (direction === "TD") {
    const firstBend = connector.points[1];
    if (firstBend && firstBend[0] !== 0) {
      return { x: connector.x + 38, y: connector.y - 26 };
    }
    return { x: connector.x + branchOffset, y: connector.y + 24 };
  }
  if (direction === "LR") {
    return { x: connector.x + 52, y: connector.y + branchOffset };
  }
  const [, firstBend, secondBend] = connector.points;
  if (firstBend && secondBend) {
    const isVerticalFirst = firstBend[0] === 0;
    if (isVerticalFirst) {
      return {
        x: connector.x + secondBend[0] / 2,
        y: connector.y + firstBend[1] - 18,
      };
    }
    return {
      x: connector.x + firstBend[0] - 44,
      y: connector.y + secondBend[1] / 2,
    };
  }
  const point = connector.points[Math.floor(connector.points.length / 2)] ?? [0, 0];
  return { x: connector.x + point[0], y: connector.y + point[1] };
};

const shapeElement = (
  id: string,
  type: "rectangle" | "ellipse" | "diamond",
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    seed: number;
    strokeColor: string;
    backgroundColor: string;
    strokeWidth: number;
    roughness: number;
    roundness: unknown;
    customData?: Record<string, unknown>;
    boundTextId?: string;
    boundElements?: Array<{ type: string; id: string }>;
  },
) => ({
  ...baseMermaidElement(id, type, x, y, width, height, options.seed),
  strokeColor: options.strokeColor,
  backgroundColor: options.backgroundColor,
  fillStyle: "solid",
  strokeWidth: options.strokeWidth,
  strokeStyle: "solid",
  roughness: options.roughness,
  roundness: options.roundness,
  boundElements:
    options.boundTextId || options.boundElements?.length
      ? [
          ...(options.boundTextId ? [{ type: "text", id: options.boundTextId }] : []),
          ...(options.boundElements ?? []),
        ]
      : null,
  ...(options.customData ? { customData: options.customData } : {}),
});

const nodeShapeType = (node: MermaidLayoutNode): "rectangle" | "ellipse" | "diamond" => {
  if (node.shape === "diamond") return "diamond";
  if (node.shape === "ellipse" || node.shape === "terminal") return "ellipse";
  return "rectangle";
};

const textElement = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  options: {
    seed: number;
    fontSize: number;
    fontFamily: number;
    strokeColor: string;
    textAlign: "left" | "center" | "right";
    verticalAlign: "top" | "middle";
    containerId?: string | null;
  },
) => ({
  ...baseMermaidElement(id, "text", x, y, width, height, options.seed),
  strokeColor: options.strokeColor,
  backgroundColor: "transparent",
  fillStyle: "solid",
  strokeWidth: 2,
  strokeStyle: "solid",
  roughness: 0,
  text,
  fontSize: options.fontSize,
  fontFamily: options.fontFamily,
  textAlign: options.textAlign,
  verticalAlign: options.verticalAlign,
  autoResize: false,
  containerId: options.containerId ?? null,
  originalText: text,
  lineHeight: 1.25,
});

const centeredNodeLabelBox = (
  node: MermaidLayoutNode,
  text: string,
  fontSize: number,
) => {
  const padding = Math.max(10, Math.min(18, Math.round(Math.min(node.width, node.height) * 0.14)));
  const lineHeight = 1.25;
  const lineCount = Math.max(1, text.split("\n").length);
  const textHeight = lineCount * fontSize * lineHeight;
  return {
    x: node.x + padding,
    y: node.y + (node.height - textHeight) / 2,
    width: Math.max(1, node.width - padding * 2),
    height: textHeight,
  };
};

const connectorElement = (
  id: string,
  x: number,
  y: number,
  points: number[][],
  options: {
    seed: number;
    strokeColor: string;
    strokeWidth: number;
    roughness: number;
    arrow: boolean;
    elbowed: boolean;
    startElementId?: string;
    endElementId?: string;
    startFixedPoint?: number[];
    endFixedPoint?: number[];
  },
) => {
  const geometry = normalizeConnectorGeometry(x, y, points);
  return {
    ...baseMermaidElement(
      id,
      options.arrow ? "arrow" : "line",
      geometry.x,
      geometry.y,
      geometry.width,
      geometry.height,
      options.seed,
    ),
    strokeColor: options.strokeColor,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: options.strokeWidth,
    strokeStyle: "solid",
    roughness: options.roughness,
    points: geometry.points,
    lastCommittedPoint: null,
    startBinding: options.startElementId
      ? { elementId: options.startElementId, focus: 0, gap: 0, fixedPoint: options.startFixedPoint ?? null }
      : null,
    endBinding: options.endElementId
      ? { elementId: options.endElementId, focus: 0, gap: 0, fixedPoint: options.endFixedPoint ?? null }
      : null,
    startArrowhead: null,
    endArrowhead: options.arrow ? "arrow" : null,
    elbowed: options.elbowed,
    roundness: null,
  };
};

const bindingFixedPoint = (
  node: MermaidLayoutNode,
  connectorX: number,
  connectorY: number,
  point: number[],
) => {
  const absoluteX = connectorX + point[0];
  const absoluteY = connectorY + point[1];
  return [
    clampNumber((absoluteX - node.x) / node.width, 0, 1),
    clampNumber((absoluteY - node.y) / node.height, 0, 1),
  ];
};

const clampNumber = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const normalizeConnectorGeometry = (x: number, y: number, points: number[][]) => {
  const xValues = points.map((point) => point[0]);
  const yValues = points.map((point) => point[1]);
  const minX = Math.min(...xValues);
  const minY = Math.min(...yValues);
  const maxX = Math.max(...xValues);
  const maxY = Math.max(...yValues);
  return {
    x: x + minX,
    y: y + minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
    points: points.map((point) => [point[0] - minX, point[1] - minY]),
  };
};

const baseMermaidElement = (
  id: string,
  type: string,
  x: number,
  y: number,
  width: number,
  height: number,
  seed: number,
) => ({
  id,
  type,
  x,
  y,
  width,
  height,
  angle: 0,
  opacity: 100,
  groupIds: [],
  frameId: null,
  seed,
  version: 1,
  versionNonce: seed + 1,
  isDeleted: false,
  boundElements: null,
  updated: Date.now(),
  link: null,
  locked: false,
});

const assertSafePath = (filePath: string) => {
  const segments = filePath.split(path.sep).filter(Boolean);
  const blocked = new Set([".ssh", ".gnupg", ".aws", ".config"]);
  const blockedSegment = segments.find((segment) => blocked.has(segment));
  if (blockedSegment) {
    throw new CliError("unsafe_path", `Refusing to use a path inside ${blockedSegment}.`, {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Use a project-local .agentdraw/*.agentdraw.json file.",
      input: { filePath },
    });
  }
};

const writeOutput = (json: unknown, text: string, options: GlobalOptions) => {
  if (outputFormat(options) === "json") {
    console.log(JSON.stringify(json, null, 2));
    return;
  }
  console.log(text);
};

const outputFormat = (options: GlobalOptions): OutputFormat =>
  options.format ?? (process.stdout.isTTY ? "text" : "json");

const openBackgroundCommand = async (options: OpenOptions, filePath: string) => {
  const url = `${displayBaseUrl(options.host, options.port)}/?file=${encodeURIComponent(filePath)}`;
  if (await isRunningAgentDrawServer(options.host, options.port)) {
    if (options.openBrowser) {
      openSystemBrowser(url);
    }
    writeOutput(
      {
        ok: true,
        command: "open",
        background: true,
        reused: true,
        filePath,
        url,
        host: options.host,
        port: options.port,
        browserOpened: options.openBrowser,
        message: "Reused the existing AgentDraw background server.",
      },
      [
        `AgentDraw ${VERSION}`,
        `File: ${filePath}`,
        `URL: ${url}`,
        `Reused existing AgentDraw server on ${options.host}:${options.port}.`,
      ].join("\n"),
      options,
    );
    return;
  }

  await assertPortAvailable(options.host, options.port);

  const cliPath = fileURLToPath(import.meta.url);
  const args = [
    cliPath,
    "open",
    filePath,
    "--host",
    options.host,
    "--port",
    String(options.port),
    options.openBrowser ? "--open" : "--no-open",
  ];
  const child = spawn(process.execPath, args, {
    cwd: options.cwd,
    detached: true,
    env: process.env,
    stdio: "ignore",
  });
  child.unref();

  writeOutput(
    {
      ok: true,
      command: "open",
      background: true,
      filePath,
      url,
      host: options.host,
      port: options.port,
      browserOpened: options.openBrowser,
      pid: child.pid,
      message: "AgentDraw server started in the background.",
    },
    [
      `AgentDraw ${VERSION}`,
      `File: ${filePath}`,
      `URL: ${url}`,
      `Background server pid: ${child.pid}`,
    ].join("\n"),
    options,
  );
};

const isRunningAgentDrawServer = async (host: string, port: number) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 700);
  try {
    const response = await fetch(displayBaseUrl(host, port), {
      signal: controller.signal,
    });
    if (!response.ok) {
      return false;
    }
    const body = await response.text();
    return body.includes("<title>AgentDraw</title>") || body.includes("AgentDraw");
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
};

const displayBaseUrl = (host: string, port: number) => {
  const displayHost = host === "0.0.0.0" || host === "::" ? "127.0.0.1" : host;
  return `http://${displayHost}:${port}`;
};

const assertPortAvailable = async (host: string, port: number) => {
  await new Promise<void>((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", (error) => {
      reject(
        new CliError("port_unavailable", `Cannot start AgentDraw on ${host}:${port}.`, {
          suggestion: "Choose another port with --port, or stop the existing AgentDraw server.",
          retryable: true,
          input: {
            host,
            port,
            cause: error instanceof Error ? error.message : String(error),
          },
        }),
      );
    });
    probe.listen(port, host, () => {
      probe.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });
};

const validateSceneWithContract = (scene: AgentDrawScene, styleId?: string) => {
  const layoutResult = validateScene(scene);
  const styleIssues = validateSceneAgainstDesignContract(scene, styleId);
  const styleErrorCount = styleIssues.filter((issue) => issue.severity === "error").length;
  const styleWarningCount = styleIssues.filter((issue) => issue.severity === "warning").length;
  return {
    errorCount: layoutResult.errorCount + styleErrorCount,
    warningCount: layoutResult.warningCount + styleWarningCount,
    issues: [...layoutResult.issues, ...styleIssues],
  };
};

const excalidrawFontFamily = (fontFamily: "hand" | "sans" | "mono") => {
  if (fontFamily === "sans") {
    return 2;
  }
  if (fontFamily === "mono") {
    return 3;
  }
  return 1;
};

const isValidationWorse = (
  after: { errorCount: number; warningCount: number },
  before: { errorCount: number; warningCount: number },
) =>
  after.errorCount > before.errorCount ||
  (after.errorCount === before.errorCount && after.warningCount > before.warningCount);

const scoreSceneQuality = (
  filePath: string,
  scene: AgentDrawScene,
  validation: QualitySummary["validation"],
): QualitySummary => {
  const elements = scene.elements.filter(isQualityElement);
  const textElements = elements.filter((element) => element.type === "text");
  const shapeElements = elements.filter((element) =>
    ["rectangle", "diamond", "ellipse"].includes(element.type ?? ""),
  );
  const connectorElements = elements.filter((element) =>
    ["arrow", "line"].includes(element.type ?? ""),
  );
  const sectionLikeShapes = shapeElements.filter((element) => {
    const width = numberValue(element.width);
    const height = numberValue(element.height);
    return width >= 280 && height >= 120;
  });
  const issueCodes = validation.issues.map((issue) => issue.code);
  const textIssueCount = countIssueCodes(issueCodes, [
    "text-box-overflow",
    "text-container-overflow",
    "text-overlap",
    "contained-text-box-too-small",
    "vertical-centering",
    "font-size-outside-contract",
    "font-family-outside-contract",
    "emoji-text",
  ]);
  const hardTextIssueCount = countIssueCodes(issueCodes, [
    "text-box-overflow",
    "text-container-overflow",
    "text-overlap",
  ]);
  const connectorIssueCount = countIssueCodes(issueCodes, [
    "connector-endpoint",
    "connector-endpoint-inside-shape",
    "connector-crosses-text",
  ]);
  const connectorErrorCount = validation.issues.filter(
    (issue) =>
      issue.severity === "error" &&
      ["connector-endpoint", "connector-endpoint-inside-shape", "connector-crosses-text"].includes(
        issue.code,
      ),
  ).length;
  const contractIssueCount = countIssueCodes(issueCodes, [
    "color-outside-contract",
    "roughness-outside-contract",
    "stroke-width-outside-contract",
    "corner-radius-outside-contract",
    "font-size-outside-contract",
    "font-family-outside-contract",
    "too-many-type-sizes",
    "style-id-mismatch",
  ]);
  const layoutDiagnostics = analyzeLayoutDiagnostics(shapeElements);

  const dimensions: QualityDimensionScore[] = [
    {
      id: "task_fit",
      name: "Task fit",
      score: scene.title && textElements.length >= 6 ? 3 : 2,
      maxScore: 4,
      basis:
        "Automatic scoring can only inspect scene content. Compare the board against the user's original prompt before treating this as final.",
      issues: scene.title ? [] : ["Scene title is missing or empty."],
      needsReview: true,
    },
    scoreStructure(scene, shapeElements.length, connectorElements.length, sectionLikeShapes.length),
    scoreVisualDesign(scene, contractIssueCount, layoutDiagnostics),
    scoreReadability(textIssueCount, hardTextIssueCount),
    scoreConnectorQuality(
      connectorElements.length,
      shapeElements.length,
      connectorIssueCount,
      connectorErrorCount,
    ),
    scoreValidationEditability(scene, validation.errorCount, validation.warningCount),
  ];

  const score = dimensions.reduce((sum, dimension) => sum + dimension.score, 0);
  const minDimensionScore = Math.min(...dimensions.map((dimension) => dimension.score));
  const verdict =
    validation.errorCount === 0 && score >= 20 && minDimensionScore >= 3
      ? "pass"
      : validation.errorCount === 0 && score >= 16
        ? "revise"
        : "fail";

  return {
    filePath,
    ok: verdict === "pass",
    verdict,
    score,
    maxScore: 24,
    minDimensionScore,
    dimensions,
    validation,
  };
};

const scoreStructure = (
  scene: AgentDrawScene,
  shapeCount: number,
  connectorCount: number,
  sectionLikeCount: number,
): QualityDimensionScore => {
  const issues: string[] = [];
  let score = 1;
  if (scene.title.trim()) score += 1;
  else issues.push("Scene title is missing.");
  if (shapeCount >= 4) score += 1;
  else issues.push("Board has too few structural shapes.");
  if (connectorCount >= 1 || sectionLikeCount >= 2) score += 1;
  else issues.push("Board has no visible connectors or section regions.");
  if (sectionLikeCount === 0 && shapeCount >= 8) {
    issues.push("Dense board lacks large section regions.");
    score = Math.min(score, 3);
  }
  return {
    id: "structure",
    name: "Structure",
    score: qualityScore(score),
    maxScore: 4,
    basis: `${shapeCount} structural shape(s), ${connectorCount} connector(s), ${sectionLikeCount} section-like region(s).`,
    issues,
  };
};

const scoreVisualDesign = (
  scene: AgentDrawScene,
  contractIssueCount: number,
  layoutDiagnostics: LayoutDiagnostics,
): QualityDimensionScore => {
  const issues: string[] = [];
  let score = 4;
  if (!scene.styleId) {
    score = 2;
    issues.push("Scene has no styleId.");
  }
  if (contractIssueCount > 12) {
    score = Math.min(score, 2);
    issues.push(`${contractIssueCount} style-contract warnings suggest the style is not being followed.`);
  } else if (contractIssueCount > 0) {
    score = Math.min(score, 3);
    issues.push(`${contractIssueCount} style-contract warning(s) should be reviewed.`);
  }
  if (layoutDiagnostics.issueCount >= 4) {
    score = Math.min(score, 2);
    issues.push(...layoutDiagnostics.issues.slice(0, 4));
  } else if (layoutDiagnostics.issueCount > 0) {
    score = Math.min(score, 3);
    issues.push(...layoutDiagnostics.issues);
  }
  return {
    id: "visual_design",
    name: "Visual design",
    score: qualityScore(score),
    maxScore: 4,
    basis: scene.styleId
      ? `Scene declares styleId "${scene.styleId}", has ${contractIssueCount} contract warning(s), and ${layoutDiagnostics.issueCount} layout warning(s).`
      : "No styleId is declared.",
    issues,
  };
};

const scoreReadability = (
  textIssueCount: number,
  hardTextIssueCount: number,
): QualityDimensionScore => {
  const issues: string[] = [];
  let score = 4;
  if (hardTextIssueCount > 0) {
    score = hardTextIssueCount > 2 ? 1 : 2;
    issues.push(`${hardTextIssueCount} hard text containment or overlap issue(s).`);
  } else if (textIssueCount > 4) {
    score = 2;
    issues.push(`${textIssueCount} readability warning(s), including text fit, centering, font family, or type scale.`);
  } else if (textIssueCount > 0) {
    score = 3;
    issues.push(`${textIssueCount} minor readability warning(s).`);
  }
  return {
    id: "readability",
    name: "Readability",
    score: qualityScore(score),
    maxScore: 4,
    basis: `${textIssueCount} text-related validation issue(s).`,
    issues,
  };
};

const scoreConnectorQuality = (
  connectorCount: number,
  shapeCount: number,
  connectorIssueCount: number,
  connectorErrorCount: number,
): QualityDimensionScore => {
  const issues: string[] = [];
  let score = 4;
  if (connectorCount === 0 && shapeCount > 3) {
    score = 2;
    issues.push("Board has multiple shapes but no connectors.");
  } else if (connectorErrorCount > 0) {
    score = 2;
    issues.push(`${connectorErrorCount} connector error(s) must be fixed.`);
  } else if (connectorIssueCount > 4) {
    score = 2;
    issues.push(`${connectorIssueCount} connector routing issue(s).`);
  } else if (connectorIssueCount > 0) {
    score = 3;
    issues.push(`${connectorIssueCount} minor connector warning(s).`);
  }
  return {
    id: "connector_quality",
    name: "Connector quality",
    score: qualityScore(score),
    maxScore: 4,
    basis: `${connectorCount} connector(s), ${connectorIssueCount} connector issue(s).`,
    issues,
  };
};

const scoreValidationEditability = (
  scene: AgentDrawScene,
  errorCount: number,
  warningCount: number,
): QualityDimensionScore => {
  const issues: string[] = [];
  let score = 4;
  if (scene.type !== "agentdraw/scene" || !Array.isArray(scene.elements)) {
    score = 1;
    issues.push("File is not a valid editable AgentDraw scene.");
  } else if (errorCount > 2) {
    score = 1;
    issues.push(`${errorCount} validation error(s).`);
  } else if (errorCount > 0) {
    score = 2;
    issues.push(`${errorCount} validation error(s).`);
  } else if (warningCount > 12) {
    score = 3;
    issues.push(`${warningCount} validation warning(s) remain.`);
  }
  return {
    id: "validation_editability",
    name: "Validation and editability",
    score: qualityScore(score),
    maxScore: 4,
    basis: `${errorCount} validation error(s), ${warningCount} warning(s).`,
    issues,
  };
};

const qualityScore = (score: number): 1 | 2 | 3 | 4 =>
  Math.max(1, Math.min(4, Math.round(score))) as 1 | 2 | 3 | 4;

const countIssueCodes = (codes: string[], targets: string[]) => {
  const targetSet = new Set(targets);
  return codes.filter((code) => targetSet.has(code)).length;
};

type LayoutBounds = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type LayoutDiagnostics = {
  issueCount: number;
  issues: string[];
};

const analyzeLayoutDiagnostics = (
  shapeElements: Array<Record<string, unknown> & { id: string; type?: string }>,
): LayoutDiagnostics => {
  const shapes = shapeElements
    .map(toLayoutBounds)
    .filter((bounds): bounds is LayoutBounds => Boolean(bounds))
    .filter((bounds) => bounds.width >= 44 && bounds.height >= 28)
    .filter((bounds) => !isLikelyOuterFrame(bounds, shapeElements.length));
  const issues: string[] = [];

  const repeated = shapes.filter((shape) => shape.width >= 80 && shape.height >= 40);
  const rowIssues = findRowAlignmentIssues(repeated);
  const columnIssues = findColumnAlignmentIssues(repeated);
  const widthIssues = findRepeatedWidthIssues(repeated);
  const whitespaceIssues = findUnderusedContainerIssues(shapes);
  const gridIssues = findGridDriftIssues(repeated);

  issues.push(...rowIssues, ...columnIssues, ...widthIssues, ...whitespaceIssues, ...gridIssues);

  return {
    issueCount: issues.length,
    issues,
  };
};

const toLayoutBounds = (
  element: Record<string, unknown> & { id: string },
): LayoutBounds | null => {
  const x = numberValue(element.x);
  const y = numberValue(element.y);
  const width = numberValue(element.width);
  const height = numberValue(element.height);
  if (width <= 0 || height <= 0) {
    return null;
  }
  return {
    id: element.id,
    x,
    y,
    width,
    height,
  };
};

const findRowAlignmentIssues = (shapes: LayoutBounds[]) => {
  const rows = clusterBy(shapes, (shape) => shape.y, 28).filter((row) => row.length >= 3);
  return rows
    .map((row) => {
      const topSpread = spread(row.map((shape) => shape.y));
      const heightSpread = spread(row.map((shape) => shape.height));
      const widthSpread = spread(row.map((shape) => shape.width));
      const medianWidth = median(row.map((shape) => shape.width));
      const looksLikeRepeatedCards = widthSpread <= Math.max(32, medianWidth * 0.18);
      if (topSpread <= 12 && (!looksLikeRepeatedCards || heightSpread <= 16)) {
        return null;
      }
      const ids = row.slice(0, 4).map((shape) => shape.id).join(", ");
      return `Row alignment is loose (${row.length} shapes, top spread ${Math.round(topSpread)}px, height spread ${Math.round(heightSpread)}px): ${ids}. Align repeated cards to a shared y and height.`;
    })
    .filter((issue): issue is string => Boolean(issue))
    .slice(0, 2);
};

const findColumnAlignmentIssues = (shapes: LayoutBounds[]) => {
  const columns = clusterBy(shapes, (shape) => shape.x, 28).filter((column) => column.length >= 3);
  return columns
    .map((column) => {
      const leftSpread = spread(column.map((shape) => shape.x));
      if (leftSpread <= 12) {
        return null;
      }
      const ids = column.slice(0, 4).map((shape) => shape.id).join(", ");
      return `Column alignment is loose (${column.length} shapes, left spread ${Math.round(leftSpread)}px): ${ids}. Align repeated cards to a shared x.`;
    })
    .filter((issue): issue is string => Boolean(issue))
    .slice(0, 2);
};

const findRepeatedWidthIssues = (shapes: LayoutBounds[]) => {
  const cardLike = shapes.filter((shape) => shape.width >= 120 && shape.width <= 700 && shape.height >= 40 && shape.height <= 260);
  const rows = clusterBy(cardLike, (shape) => centerYOf(shape), 36).filter((row) => row.length >= 3);
  const issues: string[] = [];
  for (const row of rows) {
    const widthSpread = spread(row.map((shape) => shape.width));
    const medianWidth = median(row.map((shape) => shape.width));
    if (widthSpread <= Math.max(24, medianWidth * 0.12)) {
      continue;
    }
    issues.push(
      `Repeated cards in one row have inconsistent widths (spread ${Math.round(widthSpread)}px). Use equal widths unless width encodes meaning.`,
    );
    if (issues.length >= 2) {
      break;
    }
  }
  return issues;
};

const findUnderusedContainerIssues = (shapes: LayoutBounds[]) => {
  const issues: string[] = [];
  const containers = shapes.filter((shape) => shape.width >= 420 && shape.height >= 180);
  for (const container of containers) {
    const children = shapes.filter(
      (shape) =>
        shape.id !== container.id &&
        containsLayout(container, shape, 8) &&
        shape.width >= 60 &&
        shape.height >= 28,
    );
    if (children.length < 2) {
      continue;
    }
    const widestChild = Math.max(...children.map((child) => child.width));
    const averageChildWidth =
      children.reduce((sum, child) => sum + child.width, 0) / children.length;
    const usableWidth = container.width - 48;
    if (widestChild < usableWidth * 0.55 && averageChildWidth < usableWidth * 0.42) {
      issues.push(
        `Large region ${container.id} is underused: inner cards are much narrower than the available lane. Widen or reorganize child cards to use the column deliberately.`,
      );
    }
    if (issues.length >= 2) {
      break;
    }
  }
  return issues;
};

const findGridDriftIssues = (shapes: LayoutBounds[]) => {
  if (shapes.length < 8) {
    return [];
  }
  const drifted = shapes.filter((shape) => {
    const values = [shape.x, shape.y, shape.width, shape.height];
    return values.filter((value) => distanceToGrid(value, 4) > 1.25).length >= 3;
  });
  if (drifted.length < Math.max(5, shapes.length * 0.35)) {
    return [];
  }
  return [
    `${drifted.length} structural shapes drift off the 4px grid. Snap SVG coordinates and sizes to a consistent 4/8/16px rhythm before importing.`,
  ];
};

const clusterBy = <T>(items: T[], valueOf: (item: T) => number, tolerance: number): T[][] => {
  const sorted = [...items].sort((left, right) => valueOf(left) - valueOf(right));
  const clusters: T[][] = [];
  for (const item of sorted) {
    const value = valueOf(item);
    const current = clusters[clusters.length - 1];
    if (!current) {
      clusters.push([item]);
      continue;
    }
    const anchor = median(current.map(valueOf));
    if (Math.abs(value - anchor) <= tolerance) {
      current.push(item);
    } else {
      clusters.push([item]);
    }
  }
  return clusters;
};

const spread = (values: number[]) => (values.length === 0 ? 0 : Math.max(...values) - Math.min(...values));

const median = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};

const centerYOf = (bounds: LayoutBounds) => bounds.y + bounds.height / 2;

const containsLayout = (outer: LayoutBounds, inner: LayoutBounds, padding: number) =>
  inner.x >= outer.x + padding &&
  inner.y >= outer.y + padding &&
  inner.x + inner.width <= outer.x + outer.width - padding &&
  inner.y + inner.height <= outer.y + outer.height - padding;

const distanceToGrid = (value: number, grid: number) => {
  const mod = Math.abs(value % grid);
  return Math.min(mod, grid - mod);
};

const isLikelyOuterFrame = (bounds: LayoutBounds, shapeCount: number) =>
  shapeCount > 4 && bounds.width >= 900 && bounds.height >= 500;

const isQualityElement = (
  element: unknown,
): element is Record<string, unknown> & { id: string; type?: string } =>
  Boolean(
    element &&
      typeof element === "object" &&
      typeof (element as { id?: unknown }).id === "string" &&
      !(element as { isDeleted?: unknown }).isDeleted,
  );

const numberValue = (value: unknown) => (typeof value === "number" ? value : 0);

const formatValidationText = (
  results: ValidationSummary[],
  errorCount: number,
  warningCount: number,
) => {
  if (errorCount === 0 && warningCount === 0) {
    return `Scene validation passed: ${results.length} file(s)`;
  }

  const lines = [
    `Scene validation found ${errorCount} error(s), ${warningCount} warning(s).`,
  ];
  for (const result of results) {
    if (result.issues.length === 0) {
      lines.push(`[ok] ${result.filePath}`);
      continue;
    }
    lines.push(`[${result.ok ? "warning" : "error"}] ${result.filePath}`);
    for (const issue of result.issues) {
      const ids = issue.elementIds && issue.elementIds.length > 0 ? ` (${issue.elementIds.join(", ")})` : "";
      lines.push(`  [${issue.severity}] ${issue.code}: ${issue.message}${ids}`);
    }
  }
  return lines.join("\n");
};

const formatRepairText = (
  filePath: string,
  written: boolean,
  skippedWrite: boolean,
  changeCount: number,
  validation: { errorCount: number; warningCount: number },
) =>
  [
    `Scene repair ${written ? "wrote changes" : skippedWrite ? "skipped write" : "dry run"}: ${filePath}`,
    `Changes: ${changeCount}`,
    `Validation after repair: ${validation.errorCount} error(s), ${validation.warningCount} warning(s)`,
    skippedWrite
      ? "Repair would make validation worse, so the file was left unchanged."
      : validation.errorCount > 0
      ? "Repair fixed deterministic display defaults, but layout/content issues remain. Run validate and fix reported element ids."
      : "Repair completed with zero validation errors.",
  ].join("\n");

const formatQualityText = (results: QualitySummary[]) => {
  const lines = [
    `Quality check completed: ${results.length} file(s)`,
  ];
  for (const result of results) {
    lines.push(
      `[${result.verdict}] ${result.filePath} - ${result.score}/${result.maxScore} (min dimension ${result.minDimensionScore})`,
    );
    for (const dimension of result.dimensions) {
      const review = dimension.needsReview ? " needs review" : "";
      lines.push(`  ${dimension.score}/4 ${dimension.name}:${review} ${dimension.basis}`);
      for (const issue of dimension.issues) {
        lines.push(`    - ${issue}`);
      }
    }
  }
  return lines.join("\n");
};

const formatStyleValidationText = (
  results: StyleValidationSummary[],
  errorCount: number,
  warningCount: number,
) => {
  if (errorCount === 0 && warningCount === 0) {
    return `Style contract validation passed: ${results.length} style(s)`;
  }

  const lines = [
    `Style contract validation found ${errorCount} error(s), ${warningCount} warning(s).`,
  ];
  for (const result of results) {
    if (result.issues.length === 0) {
      lines.push(`[ok] ${result.styleId}`);
      continue;
    }
    lines.push(`[${result.ok ? "warning" : "error"}] ${result.styleId}`);
    for (const issue of result.issues) {
      lines.push(`  [${issue.severity}] ${issue.code}: ${issue.message}`);
    }
  }
  return lines.join("\n");
};

const formatDoctorText = (payload: {
  ok: boolean;
  version: string;
  checks: Array<{ name: string; ok: boolean; value: string; suggestion: string }>;
}) =>
  [
    `AgentDraw ${payload.version}`,
    ...payload.checks.map((check) => {
      const status = check.ok ? "ok" : "fail";
      const suffix = check.suggestion ? ` - ${check.suggestion}` : "";
      return `[${status}] ${check.name}: ${check.value}${suffix}`;
    }),
  ].join("\n");

const formatSchemaText = (schema: unknown) => JSON.stringify(schema, null, 2);

const guidePayload = (topic: string, detail?: string) => {
  switch (topic) {
    case "workflow":
      return {
        topic,
        runtime: "Use npx @aidraw/agentdraw@latest or a global agentdraw install.",
        steps: [
          "Understand the board purpose, audience, density, and tone.",
          "Run agentdraw guide styles --json and choose one style id.",
          "Run agentdraw guide style <style-id> and agentdraw guide contract <style-id> to load the selected design system and machine-readable contract.",
          "Choose the source path: use Mermaid for conventional flowcharts/decision flows, or restricted SVG for high-design boards, architecture maps, matrices, and custom layouts.",
          "For Mermaid flowcharts, write .agentdraw/flow.mmd with flowchart TD/TB/LR syntax and run agentdraw import-mermaid .agentdraw/flow.mmd --out .agentdraw/board.agentdraw.json --style <style-id> --title <title> --format json.",
          "For SVG boards, create a restricted SVG with visible geometry, grid-aligned layout, real <text>/<tspan> labels, and the selected style rules.",
          "Preview or inspect the SVG/Mermaid source. Fix layout, alignment, text wrapping, arrows, and visual hierarchy while it is still source text.",
          "Run agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style <style-id> --title <title> --format json when using SVG.",
          "If import warnings mention unsupported SVG tags, edit the SVG and import again.",
          "Run agentdraw repair <file> --style <style-id> --write, then validate.",
          "Run agentdraw quality <file> --style <style-id> --format json, then self-check task fit against the original prompt.",
          "For higher-quality review, run agentdraw export <file> --format png --out <preview.png> and inspect the rendered preview before opening.",
          "Run agentdraw open <file> --background --open --format json when a local browser is available. On a remote or headless host, use --background --no-open and return the printed local URL.",
        ],
        commands: {
          help: "agentdraw --help",
          schema: "agentdraw schema --json",
          quality: "agentdraw guide quality",
          styles: "agentdraw guide styles --json",
          style: "agentdraw guide style <style-id>",
          contract: "agentdraw guide contract <style-id> --json",
          importMermaid: "agentdraw import-mermaid .agentdraw/flow.mmd --out .agentdraw/board.agentdraw.json --style <style-id> --title <title> --format json",
          importSvg: "agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style <style-id> --title <title> --format json",
          validate: "agentdraw validate .agentdraw/board.agentdraw.json --style <style-id> --format json",
          repair: "agentdraw repair .agentdraw/board.agentdraw.json --style <style-id> --write --format json",
          qualityCheck: "agentdraw quality .agentdraw/board.agentdraw.json --style <style-id> --format json",
          exportPreview: "agentdraw export .agentdraw/board.agentdraw.json --format png --out .agentdraw/board.preview.png --json",
          gallery: "agentdraw gallery --open --format json",
          validateStyle: "agentdraw validate-style <style-id> --format json",
          open: "agentdraw open .agentdraw/board.agentdraw.json --background --open --format json",
        },
      };
    case "quality":
      return {
        topic,
        goal:
          "Produce an editable, structured, readable, visually intentional board that a user can inspect, manually edit, or export without major repair.",
        dimensions: [
          {
            id: "task_fit",
            name: "Task fit",
            pass:
              "The board type, content, and structure match the user's request instead of becoming a generic flowchart.",
            check: "Can the user understand the requested system, journey, process, roadmap, or research wall in 30 seconds?",
          },
          {
            id: "structure",
            name: "Structure",
            pass:
              "The board has a clear title, grouped regions, reading path, meaningful hierarchy, purposeful connectors, and an enclosing frame for architecture or layered system diagrams.",
            check: "Are sections, lanes, clusters, tables, or paths visible without needing explanation?",
          },
          {
            id: "visual_design",
            name: "Visual design",
            pass:
              "The selected style affects typography, spacing, geometry, components, and layout, not only colors; hierarchy comes from type scale, contrast, grouping, repeated modules, and deliberate whitespace rather than emoji.",
            check:
              "Would a reviewer recognize the chosen design system from the output, do equal-rank cards align and share dimensions, and does agentdraw quality report no layout warnings that need repair?",
          },
          {
            id: "readability",
            name: "Readability",
            pass:
              "Text is editable, generously sized, centered when intended, and contained inside its shapes.",
            check: "No label looks clipped, cramped, off-center, or hidden by another element.",
          },
          {
            id: "connector_quality",
            name: "Connector quality",
            pass:
              "Connectors attach to meaningful shapes at the shape edge or just outside it, avoid labels and table headers, and do not create visual tangles.",
            check: "Following the arrows should make the system easier to understand, and no endpoint should sit deep inside a node.",
          },
          {
            id: "validation",
            name: "Validation",
            pass:
              "agentdraw validate <file> --format json reports zero errors before the board is delivered.",
            check: "Warnings are either repaired or intentionally accepted with a clear reason.",
          },
        ],
        selfCheck: [
          "If validation fails, repair the reported element ids before opening the board.",
          "Prefer fixing layout in the source SVG, then re-importing, before hand-editing generated scene JSON.",
          "Run agentdraw quality <file> --style <style-id> --format json. Treat pass as a preflight result, not a substitute for checking the user's prompt.",
          "Export a PNG preview for important boards and inspect it visually. Check whether the board still looks designed when zoomed out.",
          "Align repeated cards to shared x/y positions. Equal-rank cards should usually share width and height unless size encodes meaning.",
          "In columns, lanes, and large panels, inner cards should use the available width deliberately. Tiny centered cards floating in wide regions are usually a weak layout.",
          "Snap SVG coordinates and dimensions to a consistent 4/8/16px rhythm before importing.",
          "If the result looks like a generic diagram, load a stronger style with agentdraw guide styles --json and agentdraw guide style <style-id> --format text.",
          "If the user did not express a style preference and the choice is not obvious, open the gallery and ask before committing.",
          "If the scene is dense, add visible groups, section headers, or lanes before adding more detail.",
          "If text is long, resize the container or split the content; do not rely on tiny text.",
          "If text contains emoji, replace it with plain labels or simple editable shapes unless the user explicitly requested emoji.",
          "If connector endpoints sit inside a shape instead of on its edge, move the endpoint to the nearest edge or reroute the connector.",
          "If connectors cross text, reroute or change the layout.",
          "If a formal style reports corner-radius-outside-contract, remove Excalidraw proportional roundness instead of making cards pill-shaped.",
          "If redundant-outer-frame is reported, keep one global frame and delete the extra system/user frame.",
        ],
        scorecard: {
          pass: "All dimensions pass and validation has zero errors.",
          revise:
            "One or two dimensions are weak but repairable without changing the concept.",
          fail:
            "The board is generic, unreadable, not editable, not validated, or does not match the user's requested diagram type.",
        },
      };
    case "scene":
      return {
        topic,
        svgFirst: {
          description:
            "AgentDraw's primary agent workflow is SVG-first: draw a restricted SVG, then import it into editable .agentdraw.json.",
          supportedTags: ["svg", "g", "rect", "circle", "ellipse", "line", "polyline", "text", "tspan", "defs", "marker"],
          supportedTransforms: ["translate(x y)", "translate(x,y)"],
          avoidTags: ["path except marker arrowheads", "foreignObject", "image", "clipPath", "mask", "filter", "linearGradient", "radialGradient"],
          command:
            "agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style <style-id> --title <title> --format json",
        },
        mermaidImport: {
          description:
            "Use Mermaid import for conventional flowcharts and decision flows when speed and diagram semantics matter more than custom visual composition.",
          supportedSyntax: ["flowchart TD", "flowchart TB", "flowchart LR", "graph TD", "graph LR"],
          supportedNodes: ["A[Process]", "B{Decision}", "C(Start)", "D((State))"],
          supportedEdges: ["A --> B", "A --- B", "A -->|label| B"],
          command:
            "agentdraw import-mermaid .agentdraw/flow.mmd --out .agentdraw/board.agentdraw.json --style <style-id> --title <title> --format json",
        },
        editableOutput: {
          format: ".agentdraw.json",
          purpose:
            "Editable browser storage produced by import-svg. Treat it as output, not the primary source format.",
          advancedFields: ["styleId", "providerId", "elements", "appState", "files"],
        },
        notes: [
          "The SVG is the source draft; the .agentdraw.json scene is the editable browser output.",
          "Mermaid import is a shortcut for standard flowcharts. Do not use it for custom editorial boards, architecture maps, or theme-heavy compositions.",
          "Use real SVG text, rectangles, ellipses, lines, and polylines. Keep labels as text/tspan, not outlined paths or screenshots.",
          "Use title-size text for one clear title, heading-size text for sections, and body-size text for details. Hierarchy should come from size, weight, contrast, spacing, and grouping.",
          "Avoid emoji in board text unless the user explicitly asks for them.",
          "Direct .agentdraw.json generation is advanced escape-hatch usage. Prefer import-svg for new agent-generated boards.",
          "Do not persist viewport runtime fields such as scrollX, scrollY, zoom, width, height, offsetTop, selectedElementIds, or editingTextElement.",
          "Keep style guidance in the design system, not as extra metadata in the scene.",
        ],
      };
    case "patterns":
      return {
        topic,
        rules: [
          "Prefer SVG layout patterns first; only use raw scene primitives for advanced patching after import.",
          "For a centered label in SVG, draw the shape, then place text at the visual center with text-anchor=\"middle\" and dominant-baseline=\"middle\". Use tspans for multiple lines.",
          "For multiline SVG labels, set the first tspan dy to a negative offset and subsequent lines to roughly 1.2em so the block is vertically centered.",
          "Keep text as real SVG text/tspan. Do not convert text to paths.",
          "For arrows, route from edge center to edge center, keep at least 16px from text boxes, use the contract muted or ink color, and avoid crossing headers.",
          "Use plain SVG line/polyline without marker-end for dividers, timeline rails, measurement guides, and decorative rules. Only add marker-end when the line should be an arrow.",
          "Use rect rx/ry sparingly. Formal cards should use small radii, not pill-shaped corners.",
        ],
        svgCard: {
          rect: '<rect x="120" y="120" width="260" height="88" rx="6" fill="#F7F9FC" stroke="#172033" stroke-width="2" />',
          text: '<text x="250" y="164" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="650" fill="#172033">Centered label</text>',
        },
        svgMultilineCard: {
          rect: '<rect x="120" y="120" width="300" height="116" rx="6" fill="#F7F9FC" stroke="#172033" stroke-width="2" />',
          text: '<text x="270" y="178" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial, sans-serif" font-size="15" fill="#172033"><tspan x="270" dy="-0.6em">Primary label</tspan><tspan x="270" dy="1.2em">Secondary detail</tspan></text>',
        },
        svgArrow: {
          defs:
            '<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 10 5 L 0 10 z" fill="#64748B" /></marker></defs>',
          line:
            '<line x1="380" y1="164" x2="520" y2="164" stroke="#64748B" stroke-width="2" marker-end="url(#arrow)" />',
        },
      };
    case "rules":
      return {
        topic,
        rules: [
          "Do not make screenshots when an editable board is expected.",
          "For new boards, generate restricted SVG first and import it; do not start by hand-writing .agentdraw.json unless you are patching an existing scene.",
          "Do not use a style as a palette swap; follow its typography, layout, components, and avoid rules.",
          "Do not use system-formal just because examples mention it. Pick the style by audience and tone, or show the gallery and ask.",
          "Use agentdraw guide contract <style-id> as the machine-readable design constraint.",
          "Keep text editable and generously sized.",
          "Avoid emoji and decorative pictograms unless the user explicitly asks for them.",
          "Use only supported SVG tags for import: svg, g, rect, circle, ellipse, line, polyline, text, tspan, defs, marker.",
          "Do not use SVG foreignObject, image, clipPath, mask, filter, gradients, or arbitrary path geometry for editable boards.",
          "Do not rely on saved zoom or scroll state for presentation; AgentDraw fits the board on open.",
          "Run validation before opening or delivering the scene.",
          "Run repair before a second validation pass when text fields, fonts, or connector colors are inconsistent.",
          "After preview export, check that divider lines and timeline rails stayed as plain lines; unexpected arrowheads usually mean the source SVG used marker-end where it should not.",
          "Mark intentional shadows or decorative shapes with customData.role set to shadow or decoration.",
        ],
      };
    case "styles":
      return {
        topic,
        defaultStyleId: null,
        count: styles.length,
        groups: styleGroups.map((group) => ({
          level: group.level,
          styles: group.styles.map(styleSummary),
        })),
        heuristics: [
          "If the user did not state a visual preference, run agentdraw gallery --open --format json and ask which direction they prefer.",
          "Do not silently choose system-formal as a default. It is only appropriate for precise architecture, platform, and system diagrams.",
          "If you choose a style without asking, state the reason in one sentence before generating.",
          "Formal and square: system-formal, boardroom, blueprint-formal, raw-grid, neo-grid-bold.",
          "Technical documentation: runtime-doc, slate-notes, manual-cream, inkline, blueprint-formal.",
          "Incident and root-cause analysis: incident-dark, boardroom, raw-grid, inkline.",
          "High-energy technical systems: neon-grid, blueprint-formal, raw-grid.",
          "Friendly product planning: soft-pop, coral, mint-brut, pin-and-paper.",
          "Editorial and refined: grove, editorial-forest, espresso-paper, archive-shelf, linen-cut.",
          "Journey or customer experience: coral, berry-pop, soft-editorial, confetti-wedge.",
          "Playful roadmap or maker energy: mint-brut, crayon-stack, block-frame, pin-and-paper.",
          "Bold launch or campaign board: riso-brut, bold-poster, riptide-cobalt, burst-panel.",
          "Research synthesis: violet-marker, archive-shelf, soft-editorial, jade-lens.",
        ],
      };
    case "style":
      if (!detail) {
        throw new CliError("missing_argument", "Style id is required.", {
          exitCode: EXIT_USAGE_ERROR,
          suggestion: "Run: agentdraw guide styles --json",
        });
      }
      return {
        topic,
        style: readStyleGuide(detail),
      };
    case "contract":
      if (!detail) {
        throw new CliError("missing_argument", "Style id is required.", {
          exitCode: EXIT_USAGE_ERROR,
          suggestion: "Run: agentdraw guide styles --json",
        });
      }
      return {
        topic,
        contract: readDesignContract(detail),
      };
    default:
      throw new CliError("unknown_guide_topic", `Unknown guide topic: ${topic}`, {
        exitCode: EXIT_USAGE_ERROR,
        suggestion: "Run: agentdraw help guide",
        input: { topic },
      });
  }
};

const formatGuideText = (topic: string, detail?: string) => {
  if (topic === "style") {
    if (!detail) {
      guidePayload(topic, detail);
    }
    return readStyleGuide(detail!).markdown;
  }

  if (topic === "contract") {
    if (!detail) {
      guidePayload(topic, detail);
    }
    const contract = readDesignContract(detail!);
    return [
      `# ${contract.name} Design Contract`,
      "",
      contract.summary,
      "",
      "## Palette",
      "",
      ...Object.entries(contract.palette).map(([role, value]) => `- ${role}: ${value}`),
      "",
      "## Typography",
      "",
      `- Font family: ${contract.typography.fontFamily}`,
      `- Title: ${contract.typography.titlePx[0]}-${contract.typography.titlePx[1]}px`,
      `- Heading: ${contract.typography.headingPx[0]}-${contract.typography.headingPx[1]}px`,
      `- Body: ${contract.typography.bodyPx[0]}-${contract.typography.bodyPx[1]}px`,
      `- Max type sizes per board: ${contract.typography.maxTypeSizesPerBoard}`,
      "",
      "## Geometry",
      "",
      `- Roughness: ${contract.geometry.roughness[0]}-${contract.geometry.roughness[1]}`,
      `- Stroke width: ${contract.geometry.strokeWidth[0]}-${contract.geometry.strokeWidth[1]}px`,
      `- Corner radius: ${contract.geometry.cornerRadiusPx[0]}-${contract.geometry.cornerRadiusPx[1]}px`,
      "",
      "## Layout",
      "",
      `- Grid: ${contract.layout.gridPx}px`,
      `- Major gap: at least ${contract.layout.minMajorGapPx}px`,
      `- Connector/text gap: at least ${contract.layout.minConnectorTextGapPx}px`,
      "",
      "## Agent Rules",
      "",
      ...contract.agentRules.map((rule) => `- ${rule}`),
      "",
      "## Avoid",
      "",
      ...contract.avoid.map((rule) => `- ${rule}`),
    ].join("\n");
  }

  if (topic === "styles") {
    return [
      "# AgentDraw Design Catalog",
      "",
      `AgentDraw includes ${styles.length} agent-readable design systems. Pick by audience, density, and tone, then load the selected design with \`agentdraw guide style <style-id>\` and \`agentdraw guide contract <style-id>\`.`,
      "",
      ...styleGroups.flatMap((group) => [
        `## ${titleCase(group.level)}`,
        "",
        "| Style | Best For / Character |",
        "| --- | --- |",
        ...group.styles.map((style) => `| \`${style.id}\` | ${style.vibe} |`),
        "",
      ]),
      "## Heuristics",
      "",
      "- Formal and square: `system-formal`, `boardroom`, `blueprint-formal`, `raw-grid`, `neo-grid-bold`.",
      "- Technical documentation: `runtime-doc`, `slate-notes`, `manual-cream`, `inkline`, `blueprint-formal`.",
      "- Incident and root-cause analysis: `incident-dark`, `boardroom`, `raw-grid`, `inkline`.",
      "- High-energy technical systems: `neon-grid`, `blueprint-formal`, `raw-grid`.",
      "- Friendly product planning: `soft-pop`, `coral`, `mint-brut`, `pin-and-paper`.",
      "- Editorial and refined: `grove`, `editorial-forest`, `espresso-paper`, `archive-shelf`, `linen-cut`.",
      "- Journey or customer experience: `coral`, `berry-pop`, `soft-editorial`, `confetti-wedge`.",
      "- Playful roadmap or maker energy: `mint-brut`, `crayon-stack`, `block-frame`, `pin-and-paper`.",
      "- Bold launch or campaign board: `riso-brut`, `bold-poster`, `riptide-cobalt`, `burst-panel`.",
      "- Research synthesis: `violet-marker`, `archive-shelf`, `soft-editorial`, `jade-lens`.",
    ].join("\n");
  }

  if (topic === "quality") {
    const qualityGuide = guidePayload("quality") as {
      goal: string;
      dimensions: Array<{
        name: string;
        pass: string;
        check: string;
      }>;
      selfCheck: string[];
      scorecard: Record<string, string>;
    };
    return [
      "# AgentDraw Quality Bar",
      "",
      qualityGuide.goal,
      "",
      "## Dimensions",
      "",
      ...qualityGuide.dimensions.flatMap((dimension) => [
        `### ${dimension.name}`,
        "",
        `Pass: ${dimension.pass}`,
        "",
        `Check: ${dimension.check}`,
        "",
      ]),
      "## Self-Check",
      "",
      ...qualityGuide.selfCheck.map((item) => `- ${item}`),
      "",
      "## Scorecard",
      "",
      `- Pass: ${qualityGuide.scorecard.pass}`,
      `- Revise: ${qualityGuide.scorecard.revise}`,
      `- Fail: ${qualityGuide.scorecard.fail}`,
    ].join("\n");
  }

  if (topic === "scene") {
    const sceneGuide = guidePayload("scene") as {
      svgFirst: Record<string, unknown>;
      mermaidImport: Record<string, unknown>;
      editableOutput: Record<string, unknown>;
      notes: string[];
    };
    return [
      "# AgentDraw Scene Contract",
      "",
      "Primary workflow: draw a restricted SVG first, then import it into editable AgentDraw JSON.",
      "",
      "```json",
      JSON.stringify(sceneGuide.svgFirst, null, 2),
      "```",
      "",
      "Mermaid shortcut:",
      "",
      "```json",
      JSON.stringify(sceneGuide.mermaidImport, null, 2),
      "```",
      "",
      "Editable output:",
      "",
      "```json",
      JSON.stringify(sceneGuide.editableOutput, null, 2),
      "```",
      "",
      "The SVG is the source draft. Scene JSON is generated editable output. Use `agentdraw schema` only when debugging or patching existing files.",
      "",
      "## Notes",
      "",
      ...sceneGuide.notes.map((note) => `- ${note}`),
    ].join("\n");
  }

  if (topic === "patterns") {
    const patternsGuide = guidePayload("patterns") as {
      rules: string[];
      svgCard: Record<string, unknown>;
      svgMultilineCard: Record<string, unknown>;
      svgArrow: Record<string, unknown>;
    };
    return [
      "# AgentDraw Primitive Patterns",
      "",
      "Use SVG patterns first, then import to editable AgentDraw JSON. These patterns reduce common model errors around vertical centering, text clipping, fonts, and connectors.",
      "",
      "## Rules",
      "",
      ...patternsGuide.rules.map((rule) => `- ${rule}`),
      "",
      "## SVG Centered Card",
      "",
      "```json",
      JSON.stringify(patternsGuide.svgCard, null, 2),
      "```",
      "",
      "## SVG Multiline Card",
      "",
      "```json",
      JSON.stringify(patternsGuide.svgMultilineCard, null, 2),
      "```",
      "",
      "## SVG Arrow",
      "",
      "```json",
      JSON.stringify(patternsGuide.svgArrow, null, 2),
      "```",
    ].join("\n");
  }

  if (topic === "rules") {
    const rulesGuide = guidePayload("rules") as { rules: string[] };
    return [
      "# AgentDraw Hard Rules",
      "",
      ...rulesGuide.rules.map((rule) => `- ${rule}`),
    ].join("\n");
  }

  const workflowGuide = guidePayload("workflow") as { steps: string[] };
  return [
    "# AgentDraw Agent Workflow",
    "",
    "Use the npm runtime. Agents do not need to import AgentDraw; use it as a local executable tool.",
    "",
    "```bash",
    "npx @aidraw/agentdraw@latest --help",
    "npx @aidraw/agentdraw@latest guide styles --json",
    "npx @aidraw/agentdraw@latest gallery --open --format json",
    "npx @aidraw/agentdraw@latest guide style <style-id>",
    "npx @aidraw/agentdraw@latest import-mermaid .agentdraw/flow.mmd --out .agentdraw/board.agentdraw.json --style <style-id> --format json",
    "npx @aidraw/agentdraw@latest import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style <style-id> --format json",
    "```",
    "",
    "Workflow:",
    "",
    ...workflowGuide.steps.map((step, index) => `${index + 1}. ${step}`),
  ].join("\n");
};

const themeGalleryHtml = () => {
  const groups = styleGroups.map((group) => ({
    level: group.level,
    styles: group.styles,
  }));
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    "<title>AgentDraw Theme Gallery</title>",
    "<style>",
    [
      ":root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#172033;background:#f7f9fc}",
      "body{margin:0}",
      "main{max-width:1180px;margin:0 auto;padding:40px 24px 64px}",
      "header{margin-bottom:28px}",
      "h1{font-size:34px;line-height:1.1;margin:0 0 10px}",
      "p{margin:0;color:#64748b;line-height:1.55}",
      "section{margin-top:34px}",
      "h2{font-size:18px;margin:0 0 14px;text-transform:capitalize}",
      ".grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}",
      ".card{border:1px solid #d9e0ea;background:#fff;border-radius:8px;overflow:hidden}",
      ".preview{display:block;width:100%;height:auto;border-bottom:1px solid #e2e8f0}",
      ".body{padding:12px 14px 14px}",
      ".name{display:flex;align-items:center;justify-content:space-between;gap:8px;font-weight:750}",
      ".id{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#64748b;font-size:12px}",
      ".vibe{font-size:13px;color:#475569;margin-top:7px;min-height:40px}",
      ".swatches{display:flex;gap:5px;margin-top:12px}",
      ".swatch{width:22px;height:22px;border-radius:4px;border:1px solid rgba(0,0,0,.16)}",
      ".hint{margin-top:18px;padding:12px 14px;border:1px solid #d9e0ea;background:#fff;border-radius:8px;font-size:14px;color:#475569}",
      "code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}",
    ].join("\n"),
    "</style>",
    "</head>",
    "<body>",
    "<main>",
    "<header>",
    "<h1>AgentDraw Theme Gallery</h1>",
    `<p>Choose a design system by audience, density, and tone. AgentDraw includes ${styles.length} bundled styles. Use the selected id with <code>agentdraw guide style &lt;style-id&gt;</code> and <code>agentdraw guide contract &lt;style-id&gt; --json</code>.</p>`,
    '<div class="hint">Agents: if the user did not express a visual preference, show this gallery URL and ask which direction they prefer. If you choose without asking, state the reason explicitly.</div>',
    "</header>",
    ...groups.flatMap((group) => [
      "<section>",
      `<h2>${escapeHtml(group.level)}</h2>`,
      '<div class="grid">',
      ...group.styles.map((style) => themeCardHtml(style)),
      "</div>",
      "</section>",
    ]),
    "</main>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
};

const themeCardHtml = (style: (typeof styles)[number]) => {
  const palette = style.palette;
  const swatches = Object.values(palette)
    .map(
      (colorValue) =>
        `<span class="swatch" title="${escapeHtml(colorValue)}" style="background:${escapeHtml(colorValue)}"></span>`,
    )
    .join("");
  return [
    '<article class="card">',
    themePreviewSvg(style),
    '<div class="body">',
    '<div class="name">',
    `<span>${escapeHtml(style.name)}</span>`,
    `<span class="id">${escapeHtml(style.id)}</span>`,
    "</div>",
    `<div class="vibe">${escapeHtml(style.vibe)}</div>`,
    `<div class="swatches">${swatches}</div>`,
    "</div>",
    "</article>",
  ].join("");
};

const writeThemeGalleryAssets = async (assetDir: string) => {
  const assets = new Map<string, string>();
  await Promise.all(
    styles.map(async (style) => {
      const previewPath = path.join(assetDir, `${style.id}.svg`);
      await writeFile(previewPath, themePreviewSvg(style), "utf8");
      assets.set(style.id, previewPath);
    }),
  );
  return assets;
};

const themePreviewSvg = (style: (typeof styles)[number]) => {
  const p = style.palette;
  const rough = style.formality === "low" ? 6 : style.formality === "medium" ? 4 : 2;
  const radius = style.formality === "high" ? 2 : style.formality === "medium" ? 8 : 14;
  return [
    `<svg class="preview" viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeHtml(style.name)} preview">`,
    `<rect width="320" height="170" fill="${escapeHtml(p.canvas)}"/>`,
    `<rect x="18" y="18" width="284" height="134" rx="${radius}" fill="${escapeHtml(p.panel)}" stroke="${escapeHtml(p.ink)}" stroke-width="${rough}"/>`,
    `<rect x="34" y="36" width="92" height="42" rx="${radius}" fill="${escapeHtml(p.accent2)}" stroke="${escapeHtml(p.ink)}" stroke-width="2"/>`,
    `<rect x="194" y="36" width="92" height="42" rx="${radius}" fill="${escapeHtml(p.accent)}" stroke="${escapeHtml(p.ink)}" stroke-width="2"/>`,
    `<path d="M128 57 L190 57" fill="none" stroke="${escapeHtml(p.accent3)}" stroke-width="3" stroke-linecap="round"/>`,
    `<path d="M184 50 L194 57 L184 64" fill="none" stroke="${escapeHtml(p.accent3)}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<rect x="34" y="98" width="252" height="30" rx="${Math.max(2, radius - 4)}" fill="${escapeHtml(p.canvas)}" stroke="${escapeHtml(p.muted)}" stroke-width="2"/>`,
    `<text x="48" y="62" fill="${escapeHtml(p.ink)}" font-size="15" font-weight="700" font-family="Inter,Arial,sans-serif">Input</text>`,
    `<text x="212" y="62" fill="${escapeHtml(p.canvas)}" font-size="15" font-weight="700" font-family="Inter,Arial,sans-serif">Output</text>`,
    `<text x="48" y="118" fill="${escapeHtml(p.ink)}" font-size="13" font-family="Inter,Arial,sans-serif">${escapeHtml(style.level)} · ${escapeHtml(style.formality)}</text>`,
    "</svg>",
  ].join("");
};

const styleSummary = (style: (typeof styles)[number]) => ({
  id: style.id,
  name: style.name,
  level: style.level,
  formality: style.formality,
  vibe: style.vibe,
  palette: style.palette,
});

const galleryStyleSummary = (style: (typeof styles)[number], previewPath?: string) => ({
  ...styleSummary(style),
  designPath: designMarkdownPath(style.id),
  previewPath,
  previewUrl: previewPath ? pathToFileURL(previewPath).toString() : null,
});

const readStyleGuide = (styleId: string) => {
  const style = styles.find((candidate) => candidate.id === styleId);
  if (!style) {
    throw new CliError("unknown_style", `Unknown style id: ${styleId}`, {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw guide styles --json",
      input: { styleId },
    });
  }
  return {
    ...styleSummary(style),
    markdown: readDesignMarkdown(style.id),
  };
};

const readDesignContract = (styleId: string) => {
  const style = styles.find((candidate) => candidate.id === styleId);
  if (!style) {
    throw new CliError("unknown_style", `Unknown style id: ${styleId}`, {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw guide styles --json",
      input: { styleId },
    });
  }
  return getDesignContract(style);
};

const readDesignMarkdown = (styleId: string) => {
  return readFileSync(designMarkdownPath(styleId), "utf8");
};

const designMarkdownPath = (styleId: string) => {
  const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const candidates = [
    path.resolve(packageRoot, "designs", styleId, "design.md"),
    path.resolve(packageRoot, "../styles/designs", styleId, "design.md"),
  ];
  for (const candidate of candidates) {
    try {
      readFileSync(candidate, "utf8");
      return candidate;
    } catch {
      // Try the next candidate; packaged and source layouts differ.
    }
  }
  throw new CliError("style_guide_missing", `Missing design guide for style: ${styleId}`, {
    exitCode: EXIT_GENERAL_ERROR,
    suggestion: "Reinstall @aidraw/agentdraw, then run: agentdraw doctor",
    input: { styleId },
  });
};

const titleCase = (input: string) =>
  input
    .split("-")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");

const escapeHtml = (value: unknown) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const printHelp = (command: string | undefined, options: GlobalOptions) => {
  const text = helpText(command);
  if (outputFormat({ ...options, format: options.format ?? "text" }) === "json") {
    console.log(JSON.stringify(commandSchema(command ? [command] : []), null, 2));
    return;
  }
  console.log(text);
};

const helpText = (command: string | undefined) => {
  switch (command) {
    case undefined:
    case "":
      return [
        "AgentDraw - local editable whiteboard workspace for coding agents.",
        "",
        "Examples:",
        "  agentdraw import-svg diagram.svg --out board.agentdraw.json --style boardroom --json",
        "  agentdraw import-mermaid flow.mmd --out flow.agentdraw.json --style blueprint-formal --json",
        "  agentdraw open board.agentdraw.json --background --open",
        "  agentdraw open board.agentdraw.json --background --no-open --format json",
        "  agentdraw validate board.agentdraw.json --format json",
        "  agentdraw repair board.agentdraw.json --style <style-id> --write --format json",
        "  agentdraw quality board.agentdraw.json --style <style-id> --format json",
        "  agentdraw export board.agentdraw.json --format png --out board.preview.png --json",
        "  agentdraw gallery --open --format json",
        "  agentdraw validate-style <style-id> --format json",
        "  agentdraw schema open --format json",
        "",
        "Commands:",
        "  open       Start the local editor for a scene file.",
        "  init       Create a scene file without starting the editor.",
        "  validate   Validate one or more scene files.",
        "  repair     Normalize deterministic scene display defaults, then validate.",
        "  quality    Score scene quality against the AgentDraw rubric.",
        "  export     Export a rendered SVG or PNG preview for visual review.",
        "  import-svg Convert a restricted SVG into an editable AgentDraw scene.",
        "  import-mermaid",
        "             Convert a Mermaid flowchart into an editable AgentDraw scene.",
        "  gallery    Generate a local HTML gallery for choosing AgentDraw themes.",
        "  validate-style",
        "             Validate installed design guides against the design-contract baseline.",
        "  doctor     Check local runtime details.",
        "  guide      Print agent workflow, quality bar, scene, rules, styles, style guides, or contracts.",
        "  schema     Print command schemas for agents.",
        "  help       Show help for a command.",
        "  version    Print the CLI version.",
        "",
        "Global flags:",
        "  --format json|text   Output format for command results. Non-TTY defaults to json.",
        "  --json               Shortcut for --format json.",
        "  --cwd <directory>    Resolve scene paths from this directory.",
        "  --no-color           Disable colored output. Currently reserved for compatibility.",
        "  -h, --help           Show help.",
        "  -v, --version        Show version.",
        "",
        "Exit codes:",
        "  0 success, 1 runtime or validation error, 2 invalid arguments.",
      ].join("\n");
    case "open":
      return [
        "Start the local AgentDraw editor for a scene file.",
        "",
        "Examples:",
        "  agentdraw open board.agentdraw.json --background --open",
        "  agentdraw open board.agentdraw.json --background --no-open --format json",
        "  agentdraw open board.agentdraw.json --no-open",
        "  agentdraw open .agentdraw/current.agentdraw.json --host 0.0.0.0 --port 3927",
        "  agentdraw open --json --no-open",
        "",
        "Usage:",
        "  agentdraw open [file] [--host <host>] [--port <port>] [--open|--no-open] [--background]",
        "",
        "Arguments:",
        `  file                Optional scene path. Default: ${DEFAULT_SCENE}`,
        "",
        "Flags:",
        `  --host <host>       Bind host. Default: ${DEFAULT_HOST}`,
        `  --port <port>       TCP port. Default: ${DEFAULT_PORT}`,
        "  --open              Launch the system browser.",
        "  --no-open           Do not launch the system browser.",
        "  --background        Start the server in the background and return immediately.",
        "  --detach            Alias for --background.",
        "  --format json|text  Output format.",
        "  --json              Shortcut for --format json.",
      ].join("\n");
    case "init":
      return [
        "Create an AgentDraw scene file if it does not already exist.",
        "",
        "Examples:",
        "  agentdraw init .agentdraw/board.agentdraw.json",
        "  agentdraw init --json",
        "",
        "Usage:",
        "  agentdraw init [file]",
        "",
        "Arguments:",
        `  file                Optional scene path. Default: ${DEFAULT_SCENE}`,
      ].join("\n");
    case "validate":
      return [
        "Validate AgentDraw scene files for generated-diagram layout issues.",
        "",
        "Examples:",
        "  agentdraw validate board.agentdraw.json",
        "  agentdraw validate board.agentdraw.json --style <style-id> --format json",
        "  agentdraw validate examples/*.agentdraw.json --format json",
        "",
        "Usage:",
        "  agentdraw validate <file...> [--style <style-id>]",
        "",
        "Arguments:",
        "  file                Required scene path. Repeat for multiple files.",
        "",
        "Flags:",
        "  --style <style-id>  Validate against a specific design contract instead of scene.styleId.",
        "",
        "Exit codes:",
        "  0 all files passed, 1 validation/runtime error, 2 invalid arguments.",
      ].join("\n");
    case "repair":
      return [
        "Normalize deterministic AgentDraw scene display defaults, then validate.",
        "",
        "Examples:",
        "  agentdraw repair board.agentdraw.json --style <style-id> --write",
        "  agentdraw repair board.agentdraw.json --style <style-id> --dry-run --json",
        "",
        "Usage:",
        "  agentdraw repair <file> [--style <style-id>] [--write|--dry-run]",
        "",
        "Arguments:",
        "  file                Required scene path.",
        "",
        "Flags:",
        "  --style <style-id>  Repair against a specific design contract instead of scene.styleId.",
        "  --write             Persist repaired scene changes.",
        "  --dry-run           Report changes without writing. This is the default unless --write is present.",
        "",
        "Notes:",
        "  Repair fixes fonts, contained text box geometry, vertical centering fields, and connector defaults. It does not redesign crowded layouts.",
      ].join("\n");
    case "quality":
      return [
        "Score AgentDraw scene quality against the AgentDraw rubric.",
        "",
        "Examples:",
        "  agentdraw quality board.agentdraw.json",
        "  agentdraw quality board.agentdraw.json --style <style-id> --json",
        "",
        "Usage:",
        "  agentdraw quality <file...> [--style <style-id>]",
        "",
        "Arguments:",
        "  file                Required scene path. Repeat for multiple files.",
        "",
        "Flags:",
        "  --style <style-id>  Score against a specific design contract instead of scene.styleId.",
        "",
        "Notes:",
        "  Automatic task-fit scoring is limited. Compare the board with the original prompt before delivery.",
      ].join("\n");
    case "export":
      return [
        "Export a rendered AgentDraw scene preview as SVG or PNG.",
        "",
        "Examples:",
        "  agentdraw export board.agentdraw.json --format svg --out board.svg",
        "  agentdraw export board.agentdraw.json --format png --out board.preview.png --scale 2 --json",
        "",
        "Usage:",
        "  agentdraw export <file> [--format svg|png] [--out <path>] [--scale <number>]",
        "",
        "Arguments:",
        "  file                Required scene path.",
        "",
        "Flags:",
        "  --format svg|png    Rendered preview format. Inferred from --out when possible. Default: svg.",
        "  --out <path>        Output path. Default: same directory and basename as the scene.",
        "  --output <path>     Alias for --out.",
        "  --scale <number>    Output scale from 0.25 to 4. Default: 1.",
        "",
        "Notes:",
        "  Use this before opening when an agent needs a visual preview for quality review.",
      ].join("\n");
    case "import-svg":
      return [
        "Convert a restricted SVG into an editable AgentDraw scene. This is the recommended agent generation path.",
        "",
        "Examples:",
        "  agentdraw import-svg diagram.svg --out board.agentdraw.json --style boardroom --json",
        "  agentdraw import-svg diagram.svg --title \"Agent workflow\"",
        "",
        "Usage:",
        "  agentdraw import-svg <file.svg> [--out <board.agentdraw.json>] [--style <style-id>] [--title <title>]",
        "",
        "Arguments:",
        "  file.svg            Required SVG path.",
        "",
        "Flags:",
        "  --out <path>        Output AgentDraw JSON path. Default: same basename with .agentdraw.json.",
        "  --output <path>     Alias for --out.",
        "  --style <style-id>  Scene style id. Default: boardroom.",
        "  --title <title>     Scene title.",
        "",
        "Notes:",
        "  Supported tags: svg, g, rect, circle, ellipse, text/tspan, line, polyline, defs, marker.",
        "  Supported transforms: translate(x y) and translate(x,y).",
        "  Avoid foreignObject, image, clipPath, mask, filter, gradients, and arbitrary path geometry.",
        "  The command succeeds when conversion succeeds. Validation errors are returned as advisory data for repair/validate follow-up.",
      ].join("\n");
    case "import-mermaid":
      return [
        "Convert a Mermaid flowchart into an editable AgentDraw scene.",
        "",
        "Examples:",
        "  agentdraw import-mermaid flow.mmd --out flow.agentdraw.json --style blueprint-formal --json",
        "  agentdraw import-mermaid flow.mmd --title \"Decision flow\"",
        "",
        "Usage:",
        "  agentdraw import-mermaid <file.mmd> [--out <board.agentdraw.json>] [--style <style-id>] [--title <title>]",
        "",
        "Arguments:",
        "  file.mmd            Required Mermaid file path.",
        "",
        "Flags:",
        "  --out <path>        Output AgentDraw JSON path. Default: same basename with .agentdraw.json.",
        "  --output <path>     Alias for --out.",
        "  --style <style-id>  Scene style id. Default: system-formal.",
        "  --title <title>     Scene title.",
        "",
        "Supported subset:",
        "  flowchart/graph with TD/TB/LR direction, simple nodes, decision diamonds, rounded terminals, ellipses, and edge labels.",
      ].join("\n");
    case "gallery":
      return [
        "Generate a local HTML gallery for choosing AgentDraw themes.",
        "",
        "Examples:",
        "  agentdraw gallery --open",
        "  agentdraw gallery .agentdraw/theme-gallery.html --no-open --json",
        "",
        "Usage:",
        "  agentdraw gallery [output.html] [--open|--no-open] [--out <path>]",
        "",
        "Arguments:",
        "  output.html         Optional HTML output path. Default: .agentdraw/theme-gallery.html",
        "",
        "Flags:",
        "  --open              Launch the system browser.",
        "  --no-open           Do not launch the system browser.",
        "  --out <path>        Output HTML path.",
        "  --output <path>     Alias for --out.",
      ].join("\n");
    case "validate-style":
      return [
        "Validate installed AgentDraw design guides against the design-contract baseline.",
        "",
        "Examples:",
        "  agentdraw validate-style",
        "  agentdraw validate-style <style-id> --json",
        "",
        "Usage:",
        "  agentdraw validate-style [style-id...]",
        "",
        "Arguments:",
        "  style-id            Optional style id. Repeat to validate multiple styles. Defaults to all styles.",
      ].join("\n");
    case "doctor":
      return [
        "Check AgentDraw CLI runtime details.",
        "",
        "Examples:",
        "  agentdraw doctor",
        "  agentdraw doctor --json",
        "",
        "Usage:",
        "  agentdraw doctor",
      ].join("\n");
    case "guide":
      return [
        "Print AgentDraw agent guidance from the installed CLI version.",
        "",
        "Examples:",
        "  agentdraw guide",
        "  agentdraw guide quality",
        "  agentdraw guide styles --json",
        "  agentdraw guide style <style-id>",
        "  agentdraw guide contract <style-id> --json",
        "  agentdraw guide patterns --json",
        "  agentdraw gallery --open",
        "  agentdraw guide scene",
        "  agentdraw guide rules",
        "",
        "Usage:",
        "  agentdraw guide [workflow|quality|styles|style|contract|scene|patterns|rules] [style-id]",
        "",
        "Notes:",
        "  Use this from SKILL.md so the installed skill stays thin and the CLI provides current guidance.",
      ].join("\n");
    case "schema":
      return [
        "Print machine-readable command schemas for agents.",
        "",
        "Examples:",
        "  agentdraw schema",
        "  agentdraw schema open --json",
        "",
        "Usage:",
        "  agentdraw schema [command]",
      ].join("\n");
    default:
      throw new CliError("unknown_command", `No help available for: ${command}`, {
        exitCode: EXIT_USAGE_ERROR,
        suggestion: "Run: agentdraw --help",
        input: { command },
      });
  }
};

const commandSchema = (commandPath: string[]) => {
  const commands = {
    open: {
      description: "Start the local editor for a scene file.",
      usage: "agentdraw open [file] [--host <host>] [--port <port>] [--open|--no-open] [--background]",
      arguments: [{ name: "file", required: false, default: DEFAULT_SCENE }],
      flags: [
        { name: "--host", type: "string", required: false, default: DEFAULT_HOST },
        { name: "--port", type: "integer", required: false, default: DEFAULT_PORT },
        { name: "--open", type: "boolean", required: false },
        { name: "--no-open", type: "boolean", required: false },
        { name: "--background", type: "boolean", required: false },
        { name: "--detach", type: "boolean", required: false },
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: [
        "agentdraw open board.agentdraw.json --background --open",
        "agentdraw open board.agentdraw.json --background --no-open --format json",
        "agentdraw open board.agentdraw.json --no-open",
        "agentdraw open .agentdraw/current.agentdraw.json --host 0.0.0.0 --port 3927",
      ],
    },
    init: {
      description: "Create a scene file if missing.",
      usage: "agentdraw init [file]",
      arguments: [{ name: "file", required: false, default: DEFAULT_SCENE }],
      flags: [
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: ["agentdraw init .agentdraw/board.agentdraw.json --json"],
    },
    validate: {
      description: "Validate one or more scene files.",
      usage: "agentdraw validate <file...> [--style <style-id>]",
      arguments: [{ name: "file", required: true, repeatable: true }],
      flags: [
        { name: "--style", type: "string", required: false },
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: [
        "agentdraw validate board.agentdraw.json",
        "agentdraw validate board.agentdraw.json --style <style-id> --format json",
        "agentdraw validate examples/*.agentdraw.json --format json",
      ],
    },
    repair: {
      description: "Normalize deterministic scene display defaults, then validate.",
      usage: "agentdraw repair <file> [--style <style-id>] [--write|--dry-run]",
      arguments: [{ name: "file", required: true }],
      flags: [
        { name: "--style", type: "string", required: false },
        { name: "--write", type: "boolean", required: false },
        { name: "--dry-run", type: "boolean", required: false },
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: [
        "agentdraw repair board.agentdraw.json --style <style-id> --write",
        "agentdraw repair board.agentdraw.json --style <style-id> --dry-run --json",
      ],
      notes: [
        "Repair fixes deterministic defaults such as text font family, contained text boxes, vertical centering fields, and connector color/stroke width.",
        "Repair does not redesign crowded layouts; run validate after repair and fix remaining element ids.",
      ],
    },
    quality: {
      description: "Score scene quality against the AgentDraw rubric.",
      usage: "agentdraw quality <file...> [--style <style-id>]",
      arguments: [{ name: "file", required: true, repeatable: true }],
      flags: [
        { name: "--style", type: "string", required: false },
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: [
        "agentdraw quality board.agentdraw.json",
        "agentdraw quality board.agentdraw.json --style <style-id> --format json",
      ],
      notes: [
        "Automatic task-fit scoring is limited. Compare the board with the original prompt before delivery.",
      ],
    },
    export: {
      description: "Export a rendered scene preview as SVG or PNG.",
      usage: "agentdraw export <file> [--format svg|png] [--out <path>] [--scale <number>]",
      arguments: [{ name: "file", required: true }],
      flags: [
        { name: "--format", type: "enum", values: ["svg", "png"], required: false },
        { name: "--out", type: "string", required: false },
        { name: "--output", type: "string", required: false },
        { name: "--scale", type: "number", required: false, default: 1 },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: [
        "agentdraw export board.agentdraw.json --format svg --out board.svg",
        "agentdraw export board.agentdraw.json --format png --out board.preview.png --scale 2 --json",
      ],
      notes: [
        "Use exported previews when an agent or reviewer needs to inspect rendered output before opening the editor.",
      ],
    },
    "import-svg": {
      description: "Convert a restricted SVG into an editable AgentDraw scene. This is the recommended agent generation path.",
      usage: "agentdraw import-svg <file.svg> [--out <board.agentdraw.json>] [--style <style-id>] [--title <title>]",
      arguments: [{ name: "file.svg", required: true }],
      flags: [
        { name: "--out", type: "string", required: false },
        { name: "--output", type: "string", required: false },
        { name: "--style", type: "string", required: false, default: "boardroom" },
        { name: "--title", type: "string", required: false },
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: [
        "agentdraw import-svg diagram.svg --out board.agentdraw.json --style boardroom --json",
      ],
      notes: [
        "Supported SVG subset: svg, g, rect, circle, ellipse, text/tspan, line, polyline, defs, marker, and g translate(). Unsupported tags are skipped with warnings.",
      ],
    },
    "import-mermaid": {
      description: "Convert a Mermaid flowchart into an editable AgentDraw scene.",
      usage: "agentdraw import-mermaid <file.mmd> [--out <board.agentdraw.json>] [--style <style-id>] [--title <title>]",
      arguments: [{ name: "file.mmd", required: true }],
      flags: [
        { name: "--out", type: "string", required: false },
        { name: "--output", type: "string", required: false },
        { name: "--style", type: "string", required: false, default: "system-formal" },
        { name: "--title", type: "string", required: false },
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: [
        "agentdraw import-mermaid flow.mmd --out flow.agentdraw.json --style blueprint-formal --json",
      ],
      notes: [
        "Supported Mermaid subset: flowchart/graph with TD/TB/LR direction, simple nodes, decision diamonds, rounded terminals, ellipses, and edge labels.",
        "Use SVG import for high-design boards and Mermaid import for conventional process diagrams that should remain editable.",
      ],
    },
    gallery: {
      description: "Generate a local HTML gallery for choosing AgentDraw themes.",
      usage: "agentdraw gallery [output.html] [--open|--no-open] [--out <path>]",
      arguments: [{ name: "output.html", required: false, default: ".agentdraw/theme-gallery.html" }],
      flags: [
        { name: "--open", type: "boolean", required: false },
        { name: "--no-open", type: "boolean", required: false },
        { name: "--out", type: "string", required: false },
        { name: "--output", type: "string", required: false },
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: [
        "agentdraw gallery --open",
        "agentdraw gallery .agentdraw/theme-gallery.html --no-open --json",
      ],
      notes: [
        "Use this when the user has not expressed a visual preference. Show the URL and ask which direction they prefer.",
      ],
    },
    "validate-style": {
      description: "Validate installed design guides against the design-contract baseline.",
      usage: "agentdraw validate-style [style-id...]",
      arguments: [{ name: "style-id", required: false, repeatable: true }],
      flags: [
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: [
        "agentdraw validate-style",
        "agentdraw validate-style <style-id> --json",
      ],
    },
    doctor: {
      description: "Check local runtime details.",
      usage: "agentdraw doctor",
      arguments: [],
      flags: [
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: ["agentdraw doctor --json"],
    },
    schema: {
      description: "Print command schemas for agents.",
      usage: "agentdraw schema [command]",
      arguments: [{ name: "command", required: false }],
      flags: [
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: ["agentdraw schema", "agentdraw schema open --json"],
    },
    guide: {
      description: "Print agent workflow, quality bar, scene contract, hard rules, style catalog, one style guide, or one machine-readable design contract.",
      usage: "agentdraw guide [workflow|quality|styles|style|contract|scene|rules] [style-id]",
      arguments: [
        {
          name: "topic",
          required: false,
          default: "workflow",
          values: ["workflow", "quality", "styles", "style", "contract", "scene", "patterns", "rules"],
        },
        { name: "style-id", required: false },
      ],
      flags: [
        { name: "--format", type: "enum", values: ["json", "text"], required: false },
        { name: "--json", type: "boolean", required: false },
      ],
      examples: [
        "agentdraw guide",
        "agentdraw guide quality",
        "agentdraw guide styles --json",
        "agentdraw guide style <style-id>",
        "agentdraw guide contract <style-id> --json",
        "agentdraw guide patterns --json",
      ],
    },
  };

  if (commandPath.length === 0) {
    return {
      name: "agentdraw",
      version: VERSION,
      description: "Local editable whiteboard workspace for coding agents.",
      commands,
      globalFlags: [
        { name: "--format", type: "enum", values: ["json", "text"] },
        { name: "--json", type: "boolean" },
        { name: "--cwd", type: "string" },
        { name: "--no-color", type: "boolean" },
        { name: "--help", type: "boolean" },
        { name: "--version", type: "boolean" },
      ],
      exitCodes: {
        "0": "success",
        "1": "runtime or validation error",
        "2": "invalid arguments",
      },
    };
  }

  const [command] = commandPath;
  if (!(command in commands)) {
    throw new CliError("unknown_command", `Unknown command schema: ${command}`, {
      exitCode: EXIT_USAGE_ERROR,
      suggestion: "Run: agentdraw schema",
      input: { command },
    });
  }

  return {
    name: `agentdraw ${command}`,
    version: VERSION,
    ...commands[command as keyof typeof commands],
  };
};

const waitForShutdown = async (close: () => Promise<void>) => {
  await new Promise<void>((resolve) => {
    const shutdown = async () => {
      try {
        await close();
      } finally {
        resolve();
      }
    };
    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
  });
};

const openSystemBrowser = (url: string) => {
  const { command, args } = browserCommand(url);
  const child = spawn(command, args, {
    stdio: "ignore",
    detached: true,
  });
  child.unref();
};

const browserCommand = (url = "") => {
  if (process.platform === "darwin") {
    return { command: "open", args: [url].filter(Boolean) };
  }
  if (process.platform === "win32") {
    return { command: "cmd", args: ["/c", "start", "", url].filter(Boolean) };
  }
  return { command: "xdg-open", args: [url].filter(Boolean) };
};

const inferCommandFromFlags = (config: { valueFlags: string[] }) =>
  config.valueFlags.includes("--port") || config.valueFlags.includes("--host")
    ? "open"
    : "";

const errorPayload = (error: unknown): AgentDrawErrorPayload => {
  if (error instanceof CliError) {
    return {
      error: error.code,
      message: error.message,
      suggestion: error.suggestion,
      retryable: error.retryable,
      ...(error.input === undefined ? {} : { input: error.input }),
    };
  }

  if (error instanceof Error) {
    return {
      error: error.name === "SyntaxError" ? "invalid_json" : "runtime_error",
      message: error.message,
      suggestion:
        error.name === "SyntaxError"
          ? "Fix the input file, then run the command again."
          : "Run: agentdraw doctor",
      retryable: false,
    };
  }

  return {
    error: "runtime_error",
    message: String(error),
    suggestion: "Run: agentdraw doctor",
    retryable: false,
  };
};

const errorExitCode = (error: unknown) =>
  error instanceof CliError ? error.exitCode : EXIT_GENERAL_ERROR;

function readPackageVersion() {
  const packageJsonPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../package.json",
  );
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      version?: unknown;
    };
    return typeof packageJson.version === "string" ? packageJson.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
}

main().catch((error) => {
  const payload = errorPayload(error);
  const shouldUseJson = !process.stderr.isTTY;
  if (shouldUseJson) {
    console.error(JSON.stringify(payload, null, 2));
  } else {
    console.error(`${payload.error}: ${payload.message}`);
    console.error(`Suggestion: ${payload.suggestion}`);
  }
  process.exit(errorExitCode(error));
});
