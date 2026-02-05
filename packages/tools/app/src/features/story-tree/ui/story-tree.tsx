import { memo } from "react";
import { useStoryTree } from "../model/use-story-tree";
import { StoryTreeView } from "./story-tree-view";
import styles from "./story-tree.module.css";

export const StoryTree = memo(() => {
  const { tree, isLoading, hasNoMatch, isEmpty, expandedGroups, toggleGroup } = useStoryTree();

  return (
    <StoryTreeView
      className={styles.list}
      emptyClassName={styles.empty}
      tree={tree}
      isLoading={isLoading}
      hasNoMatch={hasNoMatch}
      isEmpty={isEmpty}
      expandedGroups={expandedGroups}
      onToggleGroup={toggleGroup}
    />
  );
});
