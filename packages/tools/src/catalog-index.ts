#!/usr/bin/env node
import path from "node:path";
import chokidar from "chokidar";
import { generateIndex } from "@catalogue/indexer-generated/node";

const args = process.argv.slice(2);

const hasFlag = (name: string) => args.includes(`--${name}`);
const getArg = (name: string) => {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
};

const patternsArg = getArg("patterns") ?? "src/**/*.stories.tsx";
const cwdArg = getArg("cwd") ?? process.cwd();
const outputArg = getArg("output") ?? path.join(cwdArg, "src", "stories-index.ts");
const watch = hasFlag("watch");

const patterns = patternsArg.split(",").map((p) => p.trim());

const run = async () => {
  await generateIndex({ patterns, cwd: cwdArg, output: outputArg });
};

const startWatch = async () => {
  await run();
  let timer: NodeJS.Timeout | null = null;
  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      run().catch((error) => console.error(error));
    }, 100);
  };

  const watcher = chokidar.watch(patterns, {
    cwd: cwdArg,
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 50 },
  });

  watcher.on("add", schedule).on("change", schedule).on("unlink", schedule);
};

(watch ? startWatch() : run()).catch((error) => {
  console.error(error);
  process.exit(1);
});
