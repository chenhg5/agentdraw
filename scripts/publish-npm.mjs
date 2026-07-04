#!/usr/bin/env node
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const skipPack = args.has("--skip-pack");
const root = process.cwd();
const packageJsonPath = path.join(root, "packages/cli/package.json");
const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
const packageName = packageJson.name;
const version = packageJson.version;
const tarballName = `${packageName.replace(/^@/, "").replace("/", "-")}-${version}.tgz`;
const tarballPath = path.join(root, "npm", tarballName);
const token = process.env.NPM_TOKEN;

const tempDir = mkdtempSync(path.join(tmpdir(), "agentdraw-npm-"));
const npmrcPath = path.join(tempDir, ".npmrc");
const publishEnv = token ? npmEnv(npmrcPath) : process.env;

try {
  if (token) {
    writeFileSync(
      npmrcPath,
      [
        "registry=https://registry.npmjs.org/",
        `//registry.npmjs.org/:_authToken=${token}`,
        "",
      ].join("\n"),
      { mode: 0o600 },
    );
  }

  if (!skipPack) {
    run("pnpm", ["npm:pack"]);
  }

  run("npm", ["whoami"], { env: publishEnv });

  const alreadyPublished = npmView(`${packageName}@${version}`, ["version"], publishEnv);
  if (alreadyPublished.ok) {
    if (dryRun) {
      console.log(`${packageName}@${version} is already published; dry-run verified npm auth and tarball path only.`);
      process.exit(0);
    } else {
      fail(`${packageName}@${version} is already published. Bump packages/cli/package.json first.`);
    }
  }

  run(
    "npm",
    [
      "publish",
      tarballPath,
      "--access",
      "public",
      ...(dryRun ? ["--dry-run"] : []),
    ],
    { env: publishEnv },
  );

  if (!dryRun) {
    const latest = verifyLatest(packageName, version, publishEnv);
    if (!latest.ok) {
      fail(`Published ${version}, but npm latest did not verify. Output: ${latest.stdout || latest.stderr}`);
    }
    console.log(`${packageName}@${version} published and verified as latest.`);
  }
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

function npmEnv(npmrcPath) {
  return {
    ...process.env,
    NPM_CONFIG_USERCONFIG: npmrcPath,
  };
}

function npmView(spec, fields, env) {
  return runResult("npm", ["view", spec, ...fields, "--json"], {
    env,
    quiet: true,
  });
}

function verifyLatest(packageName, version, env) {
  let latest = { ok: false, stdout: "", stderr: "" };
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    latest = npmView(`${packageName}@latest`, ["version"], env);
    if (latest.ok && latest.stdout.trim().replace(/^"|"$/g, "") === version) {
      return latest;
    }
    if (attempt < 6) {
      spawnSync("sleep", ["3"], { stdio: "ignore" });
    }
  }
  return latest;
}

function run(command, commandArgs, options = {}) {
  const result = runResult(command, commandArgs, options);
  if (!result.ok) {
    fail(`Command failed: ${command} ${commandArgs.join(" ")}`);
  }
  return result;
}

function runResult(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    env: options.env ?? process.env,
    encoding: "utf8",
    stdio: options.quiet ? "pipe" : "inherit",
  });
  return {
    ok: result.status === 0,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
