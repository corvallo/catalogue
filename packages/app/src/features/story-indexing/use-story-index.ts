import { useEffect } from "react";
import { useCatalogStore } from "@catalogue-lab/shared/store";
import { loadCatalogConfig } from "@catalogue-lab/shared/config";
import { pluginHost } from "@catalogue-lab/shared/plugin";

export const useStoryIndex = () => {
  const setStoriesIndex = useCatalogStore((state) => state.setStoriesIndex);

  useEffect(() => {
    const config = loadCatalogConfig();
    const indexers = pluginHost.getIndexers();
    const targetId =
      config.indexer === "vite"
        ? "vite"
        : config.indexer === "generated"
          ? "generated"
          : config.generatedIndexPath
            ? "generated"
            : "vite";
    const indexer = indexers.find((item) => item.id === targetId);
    if (!indexer) {
      console.warn(`Indexer not found: ${targetId}`);
      setStoriesIndex({ stories: [], generatedAt: Date.now() });
      return;
    }
    indexer.index().then((index) => setStoriesIndex(index));
  }, [setStoriesIndex]);
};
