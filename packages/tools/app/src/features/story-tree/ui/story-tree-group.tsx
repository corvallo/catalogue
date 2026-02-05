import { memo } from "react";
import { ChevronDown, ChevronRight, GalleryHorizontalEnd } from "lucide-react";
import type { TreeNode } from "@catalogue/entities/story";
import { StoryTreeItem } from "./story-tree-item";
import styles from "./story-tree.module.css";

type StoryTreeGroupProps = {
  node: TreeNode;
  depth: number;
  expandedGroups: string[];
  onToggleGroup: (groupId: string) => void;
};

const labelDepthClasses = [
  styles.depth0,
  styles.depth1,
  styles.depth2,
  styles.depth3,
  styles.depth4,
  styles.depth5,
];

const getDepthClass = (depth: number, classes: string[]) => {
  const idx = Math.min(depth, classes.length - 1);
  return classes[idx];
};

export const StoryTreeGroup = memo(
  ({ node, depth, expandedGroups, onToggleGroup }: StoryTreeGroupProps) => {
    const hasCustomExpansion = expandedGroups.length > 0;
    const isCollapsed =
      node.id !== "root" && hasCustomExpansion && !expandedGroups.includes(node.id);
    const labelDepthClass = getDepthClass(depth, labelDepthClasses);
    const isTopLevelCategory = depth === 0;
    const isMutedCategory =
      isTopLevelCategory &&
      (node.name.toLowerCase() === "atoms" || node.name.toLowerCase() === "molecules");
    const showGroupIcon =
      node.id !== "root" &&
      depth > 1 &&
      !isMutedCategory &&
      (node.children.length > 0 || node.stories.length > 0);
    const groupDepthClass = depth === 1 ? styles.groupDepth1 : "";

    return (
      <div className={`${styles.group} ${groupDepthClass}`.trim()}>
        {node.id !== "root" && (
          <button className={styles.groupTitle} onClick={() => onToggleGroup(node.id)}>
            <span className={styles.groupArrow} aria-hidden="true">
              {isCollapsed ? <ChevronRight /> : <ChevronDown />}
            </span>
            {showGroupIcon && <GalleryHorizontalEnd className={styles.groupIcon} aria-hidden="true" />}
            <span
              className={`${styles.groupLabel} ${labelDepthClass} ${
                isMutedCategory ? styles.groupLabelMuted : ""
              }`}
            >
              {node.name}
            </span>
          </button>
        )}

        {!isCollapsed &&
          node.stories.map((story) => (
            <StoryTreeItem key={story.id} id={story.id} name={story.name} depth={depth + 1} />
          ))}
        {!isCollapsed &&
          node.children.map((child) => (
            <StoryTreeGroup
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedGroups={expandedGroups}
              onToggleGroup={onToggleGroup}
            />
          ))}
      </div>
    );
  }
);
