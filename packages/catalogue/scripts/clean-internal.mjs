import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..", "..", "..");
const targetRoot = path.resolve(root, "packages", "catalogue", "node_modules", "@catalogue-lab");

await rm(targetRoot, { recursive: true, force: true });
