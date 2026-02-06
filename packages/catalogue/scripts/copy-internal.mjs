import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..", "..", "..");

const packageNames = [
  "app",
  "cli",
  "core",
  "plugin-api",
  "indexer-generated",
  "indexer-vite",
  "renderer-react",
];

const targetRoot = path.resolve(root, "packages", "catalogue", "node_modules", "@catalogue-lab");

await rm(targetRoot, { recursive: true, force: true });
await mkdir(targetRoot, { recursive: true });

for (const name of packageNames) {
  const source = path.resolve(root, "packages", name);
  const target = path.resolve(targetRoot, name);
  await mkdir(target, { recursive: true });
  await cp(path.resolve(source, "package.json"), path.resolve(target, "package.json"));
  await cp(path.resolve(source, "dist"), path.resolve(target, "dist"), { recursive: true });
  if (name === "app") {
    await cp(path.resolve(source, "index.html"), path.resolve(target, "index.html"));
    await cp(path.resolve(source, "vite.config.ts"), path.resolve(target, "vite.config.ts"));
    await cp(path.resolve(source, "tsconfig.json"), path.resolve(target, "tsconfig.json"));
    await cp(path.resolve(source, "src"), path.resolve(target, "src"), { recursive: true });
    await cp(path.resolve(source, "catalog.config.ts"), path.resolve(target, "catalog.config.ts"));
  }
}
