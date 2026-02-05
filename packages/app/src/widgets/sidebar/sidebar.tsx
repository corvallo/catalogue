import { memo } from "react";
import { StorySearch } from "@catalogue-lab/features/story-search";
import { StoryTree } from "@catalogue-lab/features/story-tree";
import styles from "./sidebar.module.css";

export const Sidebar = memo(() => {
  return (
    <div className={styles.sidebarInner}>
      <StorySearch />
      <StoryTree />
    </div>
  );
});
