import { cp, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..", "..", "..");
const source = path.resolve(root, "packages", "app");
const target = path.resolve(root, "packages", "catalogue", "app");

await rm(target, { recursive: true, force: true });
await cp(source, target, {
  recursive: true,
  filter: (src) => {
    const rel = path.relative(source, src);
    if (!rel) return true;
    return !rel.startsWith("node_modules") && !rel.startsWith("dist");
  },
});
