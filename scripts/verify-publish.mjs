import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const packagesDir = path.resolve(root, "packages");

const allowed = new Set(["@catalogue/tools"]);
const offenders = [];

for (const name of fs.readdirSync(packagesDir)) {
  const pkgPath = path.join(packagesDir, name, "package.json");
  if (!fs.existsSync(pkgPath)) continue;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const isPrivate = pkg.private === true;
  if (!isPrivate && !allowed.has(pkg.name)) {
    offenders.push(pkg.name);
  }
}

if (offenders.length) {
  console.error(`Publish check failed. Only ${[...allowed].join(", ")} can be public.`);
  console.error(`Found public packages: ${offenders.join(", ")}`);
  process.exit(1);
}
