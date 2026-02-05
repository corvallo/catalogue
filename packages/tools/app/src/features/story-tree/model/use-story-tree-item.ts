import { useCallback } from "react";
import { useCatalogStore } from "@catalogue/shared/store/catalog-store";

export const useStoryTreeItem = (id: string) => {
  const isActive = useCatalogStore((state) => state.selectedStoryId === id);
  const setSelectedStoryId = useCatalogStore((state) => state.setSelectedStoryId);

  const onSelect = useCallback(() => {
    setSelectedStoryId(id);
  }, [id, setSelectedStoryId]);

  return { isActive, onSelect };
};
