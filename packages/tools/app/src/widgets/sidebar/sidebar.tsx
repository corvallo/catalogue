import { memo } from "react";
import { StorySearch } from "@catalogue/features/story-search";
import { StoryTree } from "@catalogue/features/story-tree";
import styles from "./sidebar.module.css";

export const Sidebar = memo(() => {
  return (
    <div className={styles.sidebarInner}>
      <StorySearch />
      <StoryTree />
    </div>
  );
});
