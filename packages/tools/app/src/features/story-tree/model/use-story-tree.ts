import { useMemo } from "react";
import { useCatalogStore, loadCatalogConfig } from "@catalogue/shared";
import type { StoryRef, TreeNode } from "@catalogue/entities/story";
import { buildTree, filterTree, sortTree } from "@catalogue/entities/story";

type StoryTreeState = {
  tree: TreeNode | null;
  isLoading: boolean;
  hasNoMatch: boolean;
  isEmpty: boolean;
  expandedGroups: string[];
  toggleGroup: (groupId: string) => void;
};

export const useStoryTree = (): StoryTreeState => {
  const storiesIndex = useCatalogStore((state) => state.storiesIndex);
  const searchQuery = useCatalogStore((state) => state.uiState.searchQuery);
  const expandedGroups = useCatalogStore((state) => state.uiState.expandedGroups);
  const toggleGroup = useCatalogStore((state) => state.toggleGroup);

  const tree = useMemo(() => {
    if (!storiesIndex) return null;
    const config = loadCatalogConfig();
    const base = buildTree(
      storiesIndex.stories.map<StoryRef>((story) => ({
        id: story.id,
        name: story.name,
        title: story.title,
      }))
    );
    const sorted = sortTree(base, {
      groupOrder: config.sidebarOrder,
      storySort: config.storySort,
    });
    if (!searchQuery) return sorted;
    const filtered = filterTree(sorted, searchQuery);
    return filtered ? sortTree(filtered, { groupOrder: config.sidebarOrder, storySort: config.storySort }) : null;
  }, [storiesIndex, searchQuery]);

  const isLoading = !storiesIndex;
  const hasNoMatch = Boolean(storiesIndex && !tree);
  const isEmpty = Boolean(tree && tree.children.length === 0 && tree.stories.length === 0);

  return {
    tree,
    isLoading,
    hasNoMatch,
    isEmpty,
    expandedGroups,
    toggleGroup,
  };
};
