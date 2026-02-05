import type { IndexerAdapter, StoriesIndex } from "@catalogue/plugin-api";

export type GeneratedIndexLoader = () => Promise<StoriesIndex | { index: StoriesIndex }>;

export const createGeneratedIndexer = (options: {
  loadIndex: GeneratedIndexLoader;
}): IndexerAdapter => {
  const { loadIndex } = options;

  return {
    id: "generated",
    name: "Generated Index",
    index: async () => {
      const result = await loadIndex();
      if ("index" in result) {
        return result.index;
      }
      return result;
    },
  };
};
