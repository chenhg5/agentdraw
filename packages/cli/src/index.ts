#!/usr/bin/env node
import { spawn } from "node:child_process";
import {
  normalizeScenePath,
  readOrCreateSceneFile,
  readSceneFile,
  validateScene,
} from "@agentdraw/scene";
import { startAgentDrawServer } from "@agentdraw/server";

type CliCommand = {
  name: string;
  filePath?: string;
  port: number;
  noOpen: boolean;
};

const main = async () => {
  const command = parseArgs(process.argv.slice(2));

  if (command.name === "help") {
    printHelp();
    return;
  }

  if (command.name === "validate") {
    await validateCommand(command);
    return;
  }

  if (command.name !== "open") {
    throw new Error(`Unknown command: ${command.name}`);
  }

  const cwd = process.env.INIT_CWD ?? process.cwd();
  const filePath = normalizeScenePath(
    command.filePath ?? ".agentdraw/untitled.agentdraw.json",
    cwd,
  );
  await readOrCreateSceneFile(filePath);

  const server = await startAgentDrawServer({ port: command.port, cwd });
  const url = `${server.url}/?file=${encodeURIComponent(filePath)}`;

  console.log(`AgentDraw opened: ${filePath}`);
  console.log(url);

  if (!command.noOpen) {
    openBrowser(url);
  }

  const shutdown = async () => {
    await server.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

const validateCommand = async (command: CliCommand) => {
  if (!command.filePath) {
    throw new Error("Scene file path is required.");
  }
  const cwd = process.env.INIT_CWD ?? process.cwd();
  const filePath = normalizeScenePath(command.filePath, cwd);
  const scene = await readSceneFile(filePath);
  const result = validateScene(scene);

  if (result.issues.length === 0) {
    console.log(`Scene validation passed: ${filePath}`);
    return;
  }

  console.log(
    `Scene validation found ${result.errorCount} error(s), ${result.warningCount} warning(s): ${filePath}`,
  );
  for (const issue of result.issues) {
    console.log(
      `[${issue.severity}] ${issue.code}: ${issue.message} (${issue.elementIds.join(", ")})`,
    );
  }

  if (result.errorCount > 0) {
    process.exitCode = 1;
  }
};

const parseArgs = (args: string[]): CliCommand => {
  const [name = "help", maybePath, ...rest] = args;
  const all = [maybePath, ...rest].filter(Boolean);

  return {
    name,
    filePath: maybePath && !maybePath.startsWith("--") ? maybePath : undefined,
    port: readNumberFlag(all, "--port") ?? 3927,
    noOpen: all.includes("--no-open"),
  };
};

const readNumberFlag = (args: string[], flag: string) => {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }
  const value = Number(args[index + 1]);
  return Number.isFinite(value) ? value : undefined;
};

const printHelp = () => {
  console.log(`Usage:
  agentdraw open [file] [--port 3927] [--no-open]
  agentdraw validate <file>

Examples:
  agentdraw open examples/getting-started.agentdraw.json
  agentdraw open .agentdraw/current.agentdraw.json --no-open
  agentdraw validate examples/getting-started.agentdraw.json`);
};

const openBrowser = (url: string) => {
  const command =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "cmd"
        : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const child = spawn(command, args, {
    stdio: "ignore",
    detached: true,
  });
  child.unref();
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
