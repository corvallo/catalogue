import type { TreeNode } from "@catalogue/entities/story";
import { StoryTreeGroup } from "./story-tree-group";

type StoryTreeViewProps = {
  tree: TreeNode | null;
  isLoading: boolean;
  hasNoMatch: boolean;
  isEmpty: boolean;
  expandedGroups: string[];
  onToggleGroup: (groupId: string) => void;
  className?: string;
  emptyClassName?: string;
};

export const StoryTreeView = ({
  tree,
  isLoading,
  hasNoMatch,
  isEmpty,
  expandedGroups,
  onToggleGroup,
  className,
  emptyClassName,
}: StoryTreeViewProps) => {
  return (
    <div className={className}>
      {isLoading && <div className={emptyClassName}>Indexing stories…</div>}
      {hasNoMatch && <div className={emptyClassName}>No stories found.</div>}
      {isEmpty && <div className={emptyClassName}>No stories found.</div>}
      {tree && (
        <StoryTreeGroup
          node={tree}
          depth={0}
          expandedGroups={expandedGroups}
          onToggleGroup={onToggleGroup}
        />
      )}
    </div>
  );
};
