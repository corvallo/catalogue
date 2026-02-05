import { useEffect } from "react";
import { loadCatalogConfig } from "@catalogue-lab/shared/config";
import { useCatalogStore } from "@catalogue-lab/shared/store";

export const useCatalogConfig = () => {
  const setToolbarConfig = useCatalogStore((state) => state.setToolbarConfig);
  const toolbarConfig = useCatalogStore((state) => state.toolbarConfig);

  useEffect(() => {
    if (toolbarConfig.length) return;
    const config = loadCatalogConfig();
    if (config.toolbar?.length) {
      setToolbarConfig(config.toolbar);
    }
  }, [setToolbarConfig, toolbarConfig.length]);
};
