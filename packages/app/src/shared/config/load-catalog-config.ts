import { catalogConfig } from "@catalogue-lab/config";
import type { ToolbarItemConfig } from "../store";

type CatalogConfig = {
  toolbar?: ToolbarItemConfig[];
  indexer?: "vite" | "generated" | "auto";
  generatedIndexPath?: string;
  stories?: string[];
  sidebarOrder?: string[];
  storySort?: "alpha" | "natural";
};

export const loadCatalogConfig = (): CatalogConfig => {
  const typedConfig = catalogConfig as CatalogConfig;
  const envIndexer = import.meta.env.VITE_CATALOGUE_INDEXER as
    | "vite"
    | "generated"
    | "auto"
    | undefined;
  const envIndexPath = import.meta.env.VITE_CATALOGUE_GENERATED_INDEX_PATH as string | undefined;
  const envStories = import.meta.env.VITE_CATALOGUE_STORIES as string | undefined;
  return {
    toolbar: typedConfig.toolbar ?? [],
    indexer: envIndexer ?? typedConfig.indexer ?? "generated",
    generatedIndexPath:
      envIndexPath ?? typedConfig.generatedIndexPath ?? "/src/stories-index",
    stories: envStories
      ? envStories.split(",").map((pattern) => pattern.trim())
      : (typedConfig.stories ?? ["src/**/*.stories.tsx"]),
    sidebarOrder: typedConfig.sidebarOrder ?? [],
    storySort: typedConfig.storySort ?? "alpha",
  };
};
