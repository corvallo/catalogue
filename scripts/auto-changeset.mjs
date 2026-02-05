import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const changesetDir = path.resolve(root, ".changeset");

const existing = fs
  .readdirSync(changesetDir)
  .filter((file) => file.endsWith(".md") && file !== "template.md");

if (existing.length) {
  process.exit(0);
}

let lastTag = "";
try {
  lastTag = execSync("git describe --tags --abbrev=0", { encoding: "utf8" }).trim();
} catch {
  lastTag = "";
}

const range = lastTag ? `${lastTag}..HEAD` : "HEAD";
const log = execSync(`git log --format=%s ${range}`, { encoding: "utf8" }).trim();
const commits = log ? log.split("\n") : [];

const isConventional = (msg) =>
  /^(feat|fix|chore|refactor|perf|docs|test|build|ci)(\(.+\))?!?:/i.test(msg);
const hasConventional = commits.some(isConventional);

if (!hasConventional) {
  console.error("No conventional commits found. Add a changeset or use conventional commits.");
  process.exit(1);
}

let bump = "patch";
const hasBreaking = commits.some((msg) => msg.includes("BREAKING") || /\w+!:/i.test(msg));
const hasFeat = commits.some((msg) => /^feat(\(.+\))?:/i.test(msg));
const hasFix = commits.some((msg) => /^fix(\(.+\))?:/i.test(msg));

if (hasBreaking) bump = "major";
else if (hasFeat) bump = "minor";
else if (hasFix) bump = "patch";

const summary = commits[0] ?? "Automated release";
const name = `auto-${Date.now()}.md`;
const content = `---\n"@catalogue/tools": ${bump}\n---\n\n${summary}\n`;

fs.writeFileSync(path.join(changesetDir, name), content, "utf8");
