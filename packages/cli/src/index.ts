#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
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

const galleryCommand = async (options: GalleryOptions) => {
  const outputPath = options.outputPath
    ? path.resolve(options.cwd, options.outputPath)
    : path.resolve(options.cwd, ".agentdraw/theme-gallery.html");
  await mkdir(path.dirname(outputPath), { recursive: true });
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
    "font-size-outside-contract",
    "font-family-outside-contract",
    "too-many-type-sizes",
    "style-id-mismatch",
  ]);

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
    scoreVisualDesign(scene, contractIssueCount),
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
  return {
    id: "visual_design",
    name: "Visual design",
    score: qualityScore(score),
    maxScore: 4,
    basis: scene.styleId
      ? `Scene declares styleId "${scene.styleId}" and has ${contractIssueCount} contract warning(s).`
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
          "Create or patch a .agentdraw.json scene with editable primitives.",
          "Run agentdraw validate <file> --format json and repair reported element ids.",
          "If common display defaults are wrong, run agentdraw repair <file> --style <style-id> --write, then validate again.",
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
              "The selected style affects typography, spacing, geometry, components, and layout, not only colors; hierarchy comes from type scale, contrast, and grouping rather than emoji.",
            check: "Would a reviewer recognize the chosen design system from the output, and does agentdraw validate report no style-contract warnings that need repair?",
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
          "Run agentdraw quality <file> --style <style-id> --format json. Treat pass as a preflight result, not a substitute for checking the user's prompt.",
          "If the result looks like a generic diagram, load a stronger style with agentdraw guide styles --json and agentdraw guide style <style-id> --format text.",
          "If the user did not express a style preference and the choice is not obvious, open the gallery and ask before committing.",
          "If the scene is dense, add visible groups, section headers, or lanes before adding more detail.",
          "If text is long, resize the container or split the content; do not rely on tiny text.",
          "If text contains emoji, replace it with plain labels or simple editable shapes unless the user explicitly requested emoji.",
          "If connector endpoints sit inside a shape instead of on its edge, move the endpoint to the nearest edge or reroute the connector.",
          "If connectors cross text, reroute or change the layout.",
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
        envelope: {
          type: "agentdraw/scene",
          version: 1,
          title: "System map",
          styleId: "system-formal",
          providerId: "excalidraw",
          elements: [],
          appState: {},
          files: {},
        },
        notes: [
          "The scene is editable output, not a screenshot.",
          "Use editable text, rectangles, ellipses, diamonds, arrows, and lines.",
          "For Excalidraw text, include text, originalText, fontSize, fontFamily, lineHeight, baseline, textAlign, verticalAlign, and autoResize. AgentDraw repairs missing display defaults, but complete text fields are more portable.",
          "Use fontFamily 2 for default sans text unless agentdraw guide contract <style-id> says otherwise. Avoid fontFamily 1 for Chinese or multilingual boards unless the user explicitly asks for a hand-drawn look.",
          "Use title-size text for one clear title, heading-size text for sections, and body-size text for details. AgentDraw editor text is not rich text, so hierarchy should come from size, contrast, and spacing.",
          "Avoid emoji in board text unless the user explicitly asks for them.",
          "Do not persist viewport runtime fields such as scrollX, scrollY, zoom, width, height, offsetTop, selectedElementIds, or editingTextElement.",
          "Keep style guidance in the design system, not as extra metadata in the scene.",
        ],
      };
    case "patterns":
      return {
        topic,
        rules: [
          "Prefer these primitive patterns over hand-calculating Excalidraw text layout.",
          "For a centered label inside a shape, create a rectangle and a separate text element inset by 12-20px, with textAlign center, verticalAlign middle, autoResize false, fontFamily 2, and lineHeight 1.25.",
          "Do not set text x/y equal to the container top-left unless the text box is intentionally full-height and autoResize is false.",
          "For multilingual boards, use fontFamily 2 unless the selected contract explicitly requires mono or hand lettering.",
          "Use title/heading/body sizes from the selected contract; do not simulate hierarchy with emoji.",
          "For arrows, route from edge center to edge center, keep at least 16px from text boxes, use the contract muted or ink color, and avoid crossing headers.",
        ],
        centeredLabel: {
          rectangle: {
            id: "card",
            type: "rectangle",
            x: 100,
            y: 100,
            width: 260,
            height: 88,
            strokeColor: "#172033",
            backgroundColor: "#F7F9FC",
            fillStyle: "solid",
            strokeWidth: 2,
            roughness: 0,
            roundness: { type: 2 },
            boundElements: [{ id: "card-label", type: "text" }],
          },
          text: {
            id: "card-label",
            type: "text",
            x: 116,
            y: 116,
            width: 228,
            height: 56,
            text: "Centered label",
            originalText: "Centered label",
            fontSize: 16,
            fontFamily: 2,
            lineHeight: 1.25,
            baseline: 34,
            textAlign: "center",
            verticalAlign: "middle",
            autoResize: false,
            containerId: "card",
            strokeColor: "#172033",
            backgroundColor: "transparent",
            fillStyle: "solid",
            roughness: 0,
          },
        },
        edgeArrow: {
          id: "arrow-a-b",
          type: "arrow",
          x: 360,
          y: 144,
          width: 120,
          height: 0,
          points: [
            [0, 0],
            [120, 0],
          ],
          strokeColor: "#64748B",
          backgroundColor: "transparent",
          fillStyle: "solid",
          strokeWidth: 2,
          roughness: 0,
          startArrowhead: null,
          endArrowhead: "arrow",
          startBinding: null,
          endBinding: null,
        },
      };
    case "rules":
      return {
        topic,
        rules: [
          "Do not make screenshots when an editable board is expected.",
          "Do not use a style as a palette swap; follow its typography, layout, components, and avoid rules.",
          "Do not use system-formal just because examples mention it. Pick the style by audience and tone, or show the gallery and ask.",
          "Use agentdraw guide contract <style-id> as the machine-readable design constraint.",
          "Keep text editable and generously sized.",
          "Avoid emoji and decorative pictograms unless the user explicitly asks for them.",
          "Do not rely on saved zoom or scroll state for presentation; AgentDraw fits the board on open.",
          "Run validation before opening or delivering the scene.",
          "Run repair before a second validation pass when text fields, fonts, or connector colors are inconsistent.",
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
          "Editorial and refined: grove, editorial-forest, macchiato, reading-room, linen-cut.",
          "Journey or customer experience: coral, berry-pop, soft-editorial, confetti-wedge.",
          "Playful roadmap or maker energy: mint-brut, crayon-stack, block-frame, pin-and-paper.",
          "Bold launch or campaign board: riso-brut, bold-poster, riptide-cobalt, burst-panel.",
          "Research synthesis: violet-marker, reading-room, soft-editorial, jade-lens.",
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
      "- Editorial and refined: `grove`, `editorial-forest`, `macchiato`, `reading-room`, `linen-cut`.",
      "- Journey or customer experience: `coral`, `berry-pop`, `soft-editorial`, `confetti-wedge`.",
      "- Playful roadmap or maker energy: `mint-brut`, `crayon-stack`, `block-frame`, `pin-and-paper`.",
      "- Bold launch or campaign board: `riso-brut`, `bold-poster`, `riptide-cobalt`, `burst-panel`.",
      "- Research synthesis: `violet-marker`, `reading-room`, `soft-editorial`, `jade-lens`.",
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
      envelope: Record<string, unknown>;
      notes: string[];
    };
    return [
      "# AgentDraw Scene Contract",
      "",
      "Use this editable scene envelope:",
      "",
      "```json",
      JSON.stringify(sceneGuide.envelope, null, 2),
      "```",
      "",
      "The scene is the editable output. The design system is guidance for creating it, not extra metadata that must be embedded in the file.",
      "",
      "## Notes",
      "",
      ...sceneGuide.notes.map((note) => `- ${note}`),
    ].join("\n");
  }

  if (topic === "patterns") {
    const patternsGuide = guidePayload("patterns") as {
      rules: string[];
      centeredLabel: Record<string, unknown>;
      edgeArrow: Record<string, unknown>;
    };
    return [
      "# AgentDraw Primitive Patterns",
      "",
      "Use these patterns when generating Excalidraw-backed AgentDraw scenes. They reduce common model errors around vertical centering, text clipping, fonts, and connectors.",
      "",
      "## Rules",
      "",
      ...patternsGuide.rules.map((rule) => `- ${rule}`),
      "",
      "## Centered Label",
      "",
      "```json",
      JSON.stringify(patternsGuide.centeredLabel, null, 2),
      "```",
      "",
      "## Edge Arrow",
      "",
      "```json",
      JSON.stringify(patternsGuide.edgeArrow, null, 2),
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
  const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const candidates = [
    path.resolve(packageRoot, "designs", styleId, "design.md"),
    path.resolve(packageRoot, "../styles/designs", styleId, "design.md"),
  ];
  for (const candidate of candidates) {
    try {
      return readFileSync(candidate, "utf8");
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
          ? "Fix the scene JSON, then run: agentdraw validate <file>"
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
