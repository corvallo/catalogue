import { memo } from "react";
import { NotebookPen } from "lucide-react";
import { Button } from "@catalogue/shared/ui";
import { useStoryTreeItem } from "../model/use-story-tree-item";
import styles from "./story-tree.module.css";

type StoryTreeItemProps = {
  id: string;
  name: string;
  depth: number;
};

const itemDepthClasses = [
  styles.itemDepth0,
  styles.itemDepth1,
  styles.itemDepth2,
  styles.itemDepth3,
  styles.itemDepth4,
  styles.itemDepth5,
];

const getDepthClass = (depth: number, classes: string[]) => {
  const idx = Math.min(depth, classes.length - 1);
  return classes[idx];
};

export const StoryTreeItem = memo(({ id, name, depth }: StoryTreeItemProps) => {
  const { isActive, onSelect } = useStoryTreeItem(id);
  const depthClass = getDepthClass(depth, itemDepthClasses);
  const showDepth3Icon = depth === 3;

  return (
    <Button
      variant="ghost"
      className={`${styles.item} ${depthClass} ${isActive ? styles.isActive : ""}`}
      onClick={onSelect}
    >
      {showDepth3Icon && <NotebookPen className={styles.itemDepth3Icon} aria-hidden="true" />}
      {name}
    </Button>
  );
});
