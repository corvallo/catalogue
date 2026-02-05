import type { Plugin, StoryModule } from "@catalogue/plugin-api";
import { createViteIndexer } from "@catalogue/indexer-vite";

const modules = import.meta.glob<StoryModule>("../../stories/**/*.stories.tsx");

export const createViteIndexerPlugin = (): Plugin => {
  return {
    manifest: {
      id: "catalogue.indexer.vite",
      version: "0.1.0",
      capabilities: ["indexer"],
      apiVersion: "0.1.0",
    },
    init: ({ registerIndexer }) => {
      registerIndexer(createViteIndexer({ modules }));
    },
  };
};
