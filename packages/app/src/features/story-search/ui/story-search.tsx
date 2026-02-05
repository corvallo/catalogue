import { Search } from "lucide-react";
import { useCatalogStore } from "@catalogue-lab/shared/store";
import { TextInput } from "@catalogue-lab/shared/ui";
import styles from "./story-search.module.css";

export const StorySearch = () => {
  const searchQuery = useCatalogStore((state) => state.uiState.searchQuery);
  const setSearchQuery = useCatalogStore((state) => state.setSearchQuery);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputShell}>
        <Search className={styles.icon} aria-hidden="true" />
        <TextInput
          className={styles.input}
          placeholder="Search stories"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>
    </div>
  );
};
