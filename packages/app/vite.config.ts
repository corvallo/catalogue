import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const exists = (relativePath: string) => {
  return fs.existsSync(path.resolve(__dirname, relativePath));
};

const localNodeModules = path.resolve(__dirname, "..", "node_modules");
const localDeps = ["react", "react-dom", "react-router-dom"]
  .map((name) => {
    const candidate = path.resolve(localNodeModules, name);
    return fs.existsSync(candidate) ? { find: name, replacement: candidate } : null;
  })
  .filter((entry): entry is { find: string; replacement: string } => Boolean(entry));

const baseAliases = [
  ...localDeps,
  { find: "@catalogue-lab/app", replacement: path.resolve(__dirname, "src/app") },
  {
    find: /^@catalogue-lab\/pages\/(.*)$/,
    replacement: path.resolve(__dirname, "src/pages") + "/$1",
  },
  { find: "@catalogue-lab/widgets", replacement: path.resolve(__dirname, "src/widgets") },
  { find: "@catalogue-lab/features", replacement: path.resolve(__dirname, "src/features") },
  { find: "@catalogue-lab/entities", replacement: path.resolve(__dirname, "src/entities") },
  {
    find: /^@catalogue-lab\/shared\/(.*)$/,
    replacement: path.resolve(__dirname, "src/shared") + "/$1",
  },
  {
    find: "@catalogue-lab/config",
    replacement: process.env.VITE_CATALOGUE_CONFIG_PATH
      ? path.resolve(process.env.VITE_CATALOGUE_CONFIG_PATH)
      : path.resolve(__dirname, "catalog.config.ts"),
  },
];

const monorepoAliases = exists("../core/src")
  ? [
      { find: "@catalogue-lab/plugin-api", replacement: path.resolve(__dirname, "../plugin-api/src") },
      { find: "@catalogue-lab/core", replacement: path.resolve(__dirname, "../core/src") },
      {
        find: "@catalogue-lab/renderer-react",
        replacement: path.resolve(__dirname, "../renderer-react/src"),
      },
      { find: "@catalogue-lab/indexer-vite", replacement: path.resolve(__dirname, "../indexer-vite/src") },
      {
        find: "@catalogue-lab/indexer-generated",
        replacement: path.resolve(__dirname, "../indexer-generated/src"),
      },
    ]
  : [];

const port = Number(process.env.CATALOGUE_PORT ?? 8008);
const projectRoot = process.env.VITE_CATALOGUE_PROJECT_ROOT;
const appRoot = path.resolve(__dirname);

const logLevel = (process.env.VITE_LOG_LEVEL as "info" | "warn" | "error" | "silent") ?? "warn";

export default defineConfig({
  plugins: [react()],
  logLevel,
  clearScreen: logLevel === "silent",
  resolve: {
    dedupe: ["react", "react-dom", "react-router-dom"],
    alias: [...baseAliases, ...monorepoAliases],
  },
  server: {
    port,
    strictPort: true,
    fs: projectRoot ? { allow: [appRoot, projectRoot] } : { allow: [appRoot] },
  },
  preview: {
    port,
  },
  
});
