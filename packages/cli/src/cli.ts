#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const command = args[0];

const log = (message: string) => {
  process.stdout.write(`${message}\n`);
};

const logError = (message: string) => {
  process.stderr.write(`${message}\n`);
};

const findUp = (startDir: string, target: string) => {
  let current = startDir;
  while (true) {
    const candidate = path.join(current, target);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
};

const findProjectRoot = (startDir: string) => {
  const pkgPath = findUp(startDir, "package.json");
  return pkgPath ? path.dirname(pkgPath) : null;
};

const resolveAppRoot = (startDir: string) => {
  const envRoot = process.env.CATALOGUE_APP_ROOT;
  if (envRoot && fs.existsSync(envRoot)) return envRoot;
  try {
    const require = createRequire(import.meta.url);
    const toolsPkg = require.resolve("@catalogue/tools/package.json", { paths: [startDir] });
    const toolsRoot = path.dirname(toolsPkg);
    const bundledApp = path.join(toolsRoot, "app");
    if (fs.existsSync(bundledApp)) return bundledApp;
  } catch {
    // ignore
  }
  const packageRoot = path.join(startDir, "node_modules", "@catalogue", "app");
  if (fs.existsSync(packageRoot)) return packageRoot;
  try {
    const require = createRequire(import.meta.url);
    const pkgPath = require.resolve("@catalogue/app/package.json");
    return path.dirname(pkgPath);
  } catch {
    // ignore
  }
  const workspaceRoot = findUp(startDir, "pnpm-workspace.yaml");
  if (workspaceRoot) {
    const monoApp = path.join(path.dirname(workspaceRoot), "packages", "app");
    if (fs.existsSync(monoApp)) return monoApp;
  }
  let current = startDir;
  while (true) {
    const candidate = path.join(current, "apps", "catalog");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
};

const readJson = <T>(filePath: string): T => {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as T;
};

const writeJson = (filePath: string, data: unknown) => {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
};

const ensureConfig = (projectRoot: string) => {
  const configPath = path.join(projectRoot, "catalog.config.ts");
  if (fs.existsSync(configPath)) return configPath;
  const contents = `export const catalogConfig = {\n  stories: ["src/**/*.stories.tsx"],\n  toolbar: [],\n};\n`;
  fs.writeFileSync(configPath, contents, "utf8");
  return configPath;
};

const resolveDepVersion = (projectRoot: string) => {
  const workspaceFile = path.join(projectRoot, "pnpm-workspace.yaml");
  return fs.existsSync(workspaceFile) ? "workspace:*" : "latest";
};

const updatePackageJson = (projectRoot: string) => {
  const pkgPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(pkgPath)) return;
  type Pkg = { scripts?: Record<string, string>; devDependencies?: Record<string, string> };
  const pkg = readJson<Pkg>(pkgPath);
  const depVersion = resolveDepVersion(projectRoot);
  pkg.scripts = pkg.scripts ?? {};
  pkg.scripts["catalogue:dev"] = "catalogue dev";
  pkg.scripts["catalogue:build"] = "catalogue build";
  pkg.devDependencies = pkg.devDependencies ?? {};
  if (!pkg.devDependencies["@catalogue/tools"]) {
    pkg.devDependencies["@catalogue/tools"] = depVersion;
  }
  writeJson(pkgPath, pkg);
};

const runCommand = (command: string, argsList: string[], cwd: string, env?: NodeJS.ProcessEnv) => {
  const child = spawn(command, argsList, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  return new Promise<void>((resolve, reject) => {
    child.on("close", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`${command} exited with code ${code}`));
    });
  });
};

const startCommand = (command: string, argsList: string[], cwd: string, env?: NodeJS.ProcessEnv) => {
  return spawn(command, argsList, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
};

const run = async () => {
  const cwd = process.cwd();
  const projectRoot = findProjectRoot(cwd);

  if (!command || command === "help" || command === "--help") {
    log("catalogue <init|dev|build>");
    return;
  }

  if (!projectRoot) {
    logError("No package.json found. Run from a project root.");
    process.exit(1);
  }

  if (command === "init") {
    const configPath = ensureConfig(projectRoot);
    updatePackageJson(projectRoot);
    log(`Created config: ${path.relative(projectRoot, configPath)}`);
    log("Added scripts: catalogue:dev, catalogue:build");
    return;
  }

  const appRoot = resolveAppRoot(projectRoot);
  if (!appRoot) {
    logError("Catalogue app not found. Set CATALOGUE_APP_ROOT or use the monorepo.");
    process.exit(1);
  }

  const configPath = path.join(projectRoot, "catalog.config.ts");
  const storiesPattern = process.env.CATALOGUE_STORIES ?? "src/**/*.stories.tsx";
  const generatedIndexPath =
    process.env.CATALOGUE_INDEX_OUTPUT ?? path.join(projectRoot, "src", "stories-index.ts");
  const fsIndexPath = `/@fs/${path.resolve(generatedIndexPath).split(path.sep).join("/")}`;
  const env = {
    VITE_CATALOGUE_CONFIG_PATH: configPath,
    VITE_CATALOGUE_INDEXER: "generated",
    VITE_CATALOGUE_GENERATED_INDEX_PATH: fsIndexPath,
    VITE_CATALOGUE_STORIES: storiesPattern,
    VITE_CATALOGUE_PROJECT_ROOT: projectRoot,
    CATALOGUE_PORT: "8008",
  };

  if (command === "dev") {
    const watcher = startCommand(
      "catalog-index",
      [
        "--watch",
        "--cwd",
        projectRoot,
        "--patterns",
        storiesPattern,
        "--output",
        generatedIndexPath,
      ],
      projectRoot
    );
    log("Catalogue running on http://localhost:8008");
    try {
      await runCommand("pnpm", ["-C", appRoot, "dev"], appRoot, {
        ...env,
        VITE_LOG_LEVEL: "silent",
      });
    } finally {
      watcher.kill("SIGTERM");
    }
    return;
  }

  if (command === "build") {
    await runCommand(
      "catalog-index",
      ["--cwd", projectRoot, "--patterns", storiesPattern, "--output", generatedIndexPath],
      projectRoot
    );
    await runCommand("pnpm", ["-C", appRoot, "build"], appRoot, {
      ...env,
      VITE_LOG_LEVEL: "silent",
    });
    return;
  }

  logError(`Unknown command: ${command}`);
  process.exit(1);
};

run().catch((error) => {
  logError(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
