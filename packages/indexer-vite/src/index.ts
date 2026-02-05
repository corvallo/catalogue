import type {
  IndexerAdapter,
  NormalizedStory,
  StoryExport,
  StoryModule,
  StoryModuleMeta,
} from "@catalogue/plugin-api";
import { createStoriesIndex, normalizeStoryModule } from "@catalogue/core";

type ViteGlobModules = Record<string, () => Promise<StoryModule>>;

const isStoryExport = (value: unknown): value is StoryExport => {
  if (value === null || value === undefined) return false;
  if (typeof value !== "object") return false;
  return true;
};

const extractStories = (module: StoryModule) => {
  const entries: Record<string, StoryExport> = {};
  for (const [key, value] of Object.entries(module)) {
    if (key === "default") continue;
    if (!isStoryExport(value)) continue;
    entries[key] = value as StoryExport;
  }
  return entries;
};

export const createViteIndexer = (options: {
  modules: ViteGlobModules;
}): IndexerAdapter => {
  const { modules } = options;

  return {
    id: "vite",
    name: "Vite Import Glob",
    index: async () => {
      const stories: NormalizedStory[] = [];
      for (const [modulePath, loadModule] of Object.entries(modules)) {
        const mod = await loadModule();
        const meta = mod.default as StoryModuleMeta | undefined;
        const moduleStories = extractStories(mod);
        const normalized = normalizeStoryModule({
          modulePath,
          filePath: modulePath,
          meta,
          stories: moduleStories,
        });
        stories.push(...normalized);
      }
      return createStoriesIndex(stories);
    },
  };
};
