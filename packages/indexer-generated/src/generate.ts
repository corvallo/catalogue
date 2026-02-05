import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import fg from "fast-glob";

type GenerateOptions = {
  patterns: string[];
  cwd: string;
  output: string;
};

const toImportPath = (fromFile: string, targetFile: string) => {
  const rel = path.relative(path.dirname(fromFile), targetFile);
  const normalized = rel.startsWith(".") ? rel : `./${rel}`;
  return normalized.split(path.sep).join("/");
};

export const generateIndex = async (options: GenerateOptions) => {
  const { patterns, cwd, output } = options;
  const files = await fg(patterns, { cwd, absolute: true });

  const imports: string[] = [];
  const modules: string[] = [];

  files.forEach((file, index) => {
    const varName = `StoryModule${index}`;
    const importPath = toImportPath(output, file);
    imports.push(`import * as ${varName} from "${importPath}";`);
    modules.push(`{ modulePath: "${importPath}", filePath: "${importPath}", mod: ${varName} }`);
  });

  const content = `import { createStoriesIndex, normalizeStoryModule } from "@catalogue-lab/catalogue/core";
import type { StoryModule, StoryModuleMeta, StoryExport } from "@catalogue-lab/catalogue";

${imports.join("\n")}

const extractStories = (module: StoryModule) => {
  const entries: Record<string, StoryExport> = {};
  for (const [key, value] of Object.entries(module)) {
    if (key === "default") continue;
    if (!value || typeof value !== "object") continue;
    entries[key] = value as StoryExport;
  }
  return entries;
};

const modules = [
  ${modules.join(",\n  ")}
];

const stories = modules.flatMap(({ modulePath, filePath, mod }) => {
  const meta = (mod as StoryModule).default as StoryModuleMeta | undefined;
  const storyExports = extractStories(mod as StoryModule);
  return normalizeStoryModule({ modulePath, filePath, meta, stories: storyExports });
});

export const index = createStoriesIndex(stories);
`;

  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, content, "utf8");
};
