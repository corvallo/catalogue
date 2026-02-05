import { useEffect } from "react";
import { useCatalogStore } from "@catalogue/shared";
import { useStoryIndex } from "@catalogue/features/story-indexing";
import { useStoryRouting } from "@catalogue/features/story-routing";
import { useCatalogConfig } from "@catalogue/features/catalog-config";
import { Toolbar } from "@catalogue/widgets/toolbar";
import { Sidebar } from "@catalogue/widgets/sidebar";
import { StoryCanvas } from "@catalogue/widgets/story-canvas";
import { StoryInfoPanel } from "@catalogue/widgets/story-info-panel";
import clsx from "clsx";
import styles from "./catalog-page.module.css";

export const CatalogPage = () => {
  useStoryIndex();
  useStoryRouting();
  useCatalogConfig();

  const storiesIndex = useCatalogStore((state) => state.storiesIndex);
  const selectedStoryId = useCatalogStore((state) => state.selectedStoryId);
  const globals = useCatalogStore((state) => state.globals);
  const remountCounter = useCatalogStore((state) => state.remountCounter);
  const uiState = useCatalogStore((state) => state.uiState);
  const activeStory = storiesIndex?.stories.find((story) => story.id === selectedStoryId);

  useEffect(() => {
    document.documentElement.dataset.theme = globals.theme;
  }, [globals.theme]);

  return (
    <div className={styles.appShell}>
      <header className={styles.toolbar}>
        <div className={styles.toolbarLogo} />
        <div className={styles.toolbarContent}>
          <Toolbar />
        </div>
      </header>
      <div className={clsx(styles.content, uiState.showInfo && styles.contentWithPanel)}>
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>
        <main
          className={clsx(
            styles.canvas,
            uiState.showGrid && styles.canvasGrid,
            uiState.showOutlines && styles.canvasOutlines
          )}
        >
          {!storiesIndex && <div>Indexing stories…</div>}
          {storiesIndex && !activeStory && <div>No matching story.</div>}
            {activeStory && (
              <div className={styles.storyContainer}>
                <StoryCanvas story={activeStory} globals={globals} remountCounter={remountCounter} />
              </div>
            )}
        </main>
        {uiState.showInfo && (
          <StoryInfoPanel story={activeStory} />
        )}
      </div>
    </div>
  );
};
