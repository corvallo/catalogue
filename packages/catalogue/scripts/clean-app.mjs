import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..", "..", "..");
const target = path.resolve(root, "packages", "catalogue", "app");

await rm(target, { recursive: true, force: true });
