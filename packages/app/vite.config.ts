import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const exists = (relativePath: string) => {
  return fs.existsSync(path.resolve(__dirname, relativePath));
};

const baseAliases = [
  { find: "@catalogue/app", replacement: path.resolve(__dirname, "src/app") },
  { find: "@catalogue/pages", replacement: path.resolve(__dirname, "src/pages") },
  { find: "@catalogue/widgets", replacement: path.resolve(__dirname, "src/widgets") },
  { find: "@catalogue/features", replacement: path.resolve(__dirname, "src/features") },
  { find: "@catalogue/entities", replacement: path.resolve(__dirname, "src/entities") },
  { find: "@catalogue/shared", replacement: path.resolve(__dirname, "src/shared") },
  {
    find: "@catalogue/config",
    replacement: process.env.VITE_CATALOGUE_CONFIG_PATH
      ? path.resolve(process.env.VITE_CATALOGUE_CONFIG_PATH)
      : path.resolve(__dirname, "catalog.config.ts"),
  },
];

const monorepoAliases = exists("../core/src")
  ? [
      { find: "@catalogue/plugin-api", replacement: path.resolve(__dirname, "../plugin-api/src") },
      { find: "@catalogue/core", replacement: path.resolve(__dirname, "../core/src") },
      {
        find: "@catalogue/renderer-react",
        replacement: path.resolve(__dirname, "../renderer-react/src"),
      },
      { find: "@catalogue/indexer-vite", replacement: path.resolve(__dirname, "../indexer-vite/src") },
      {
        find: "@catalogue/indexer-generated",
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
  server: {
    port,
    strictPort: true,
    fs: projectRoot ? { allow: [appRoot, projectRoot] } : { allow: [appRoot] },
  },
  preview: {
    port,
  },
  resolve: {
    alias: [...baseAliases, ...monorepoAliases],
  },
});
