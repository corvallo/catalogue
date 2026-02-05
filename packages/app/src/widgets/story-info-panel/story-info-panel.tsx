import clsx from "clsx";
import type { NormalizedStory } from "@catalogue-lab/plugin-api";
import styles from "./story-info-panel.module.css";

type StoryInfoPanelProps = {
  story: NormalizedStory | null | undefined;
  className?: string;
};

export const StoryInfoPanel = ({ story, className }: StoryInfoPanelProps) => {
  return (
    <aside className={clsx(styles.panel, className)}>
      {!story && <div className={styles.empty}>No story selected.</div>}
      {story && (
        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.label}>Title</div>
            <div className={styles.value}>{story.title}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>Story</div>
            <div className={styles.value}>{story.name}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>Id</div>
            <div className={styles.value}>{story.id}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>Story file</div>
            <div className={styles.value}>{story.filePath}</div>
          </div>
          {story.componentPath && (
            <div className={styles.item}>
              <div className={styles.label}>Component file</div>
              <div className={styles.value}>{story.componentPath}</div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
