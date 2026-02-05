#!/usr/bin/env node
import path from "node:path";
import { generateIndex } from "@catalogue/indexer-generated/node";

const args = process.argv.slice(2);

const getArg = (name: string) => {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
};

const patternsArg = getArg("patterns") ?? "src/**/*.stories.tsx";
const cwdArg = getArg("cwd") ?? process.cwd();
const outputArg = getArg("output") ?? path.join(cwdArg, "src", "stories-index.ts");

const patterns = patternsArg.split(",").map((p) => p.trim());

generateIndex({ patterns, cwd: cwdArg, output: outputArg }).catch((error) => {
  console.error(error);
  process.exit(1);
});
