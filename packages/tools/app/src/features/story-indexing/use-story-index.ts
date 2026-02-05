import { useEffect } from "react";
import { useCatalogStore } from "@catalogue/shared/store/catalog-store";
import { loadCatalogConfig } from "@catalogue/shared/config/load-catalog-config";
import { pluginHost } from "@catalogue/shared/plugin/plugin-host";

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
