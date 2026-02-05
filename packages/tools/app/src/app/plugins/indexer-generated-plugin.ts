import type { Plugin } from "@catalogue/plugin-api";
import { createGeneratedIndexer } from "@catalogue/indexer-generated";
import { loadCatalogConfig } from "@catalogue/shared";

export const createGeneratedIndexerPlugin = (): Plugin => {
  return {
    manifest: {
      id: "catalogue.indexer.generated",
      version: "0.1.0",
      capabilities: ["indexer"],
      apiVersion: "0.1.0",
    },
    init: ({ registerIndexer }) => {
      const config = loadCatalogConfig();
      registerIndexer(
        createGeneratedIndexer({
          loadIndex: async () => {
            try {
              const mod = await import(/* @vite-ignore */ config.generatedIndexPath!);
              if ("index" in mod) {
                return mod.index;
              }
              return mod;
            } catch {
              console.warn("Generated index not found, returning empty index.");
              return { stories: [], generatedAt: Date.now() };
            }
          },
        })
      );
    },
  };
};
