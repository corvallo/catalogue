import { createStoriesIndex, normalizeStoryModule } from "@catalogue-lab/catalogue/core";
import type { StoryModule, StoryModuleMeta, StoryExport } from "@catalogue-lab/catalogue";

import * as StoryModule0 from "./stories/info-card.stories.tsx";
import * as StoryModule1 from "./stories/toggle.stories.tsx";

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
  { modulePath: "./stories/info-card.stories.tsx", filePath: "./stories/info-card.stories.tsx", mod: StoryModule0 },
  { modulePath: "./stories/toggle.stories.tsx", filePath: "./stories/toggle.stories.tsx", mod: StoryModule1 }
];

const stories = modules.flatMap(({ modulePath, filePath, mod }) => {
  const meta = (mod as StoryModule).default as StoryModuleMeta | undefined;
  const storyExports = extractStories(mod as StoryModule);
  return normalizeStoryModule({ modulePath, filePath, meta, stories: storyExports });
});

export const index = createStoriesIndex(stories);
