import { useEffect } from "react";
import { loadCatalogConfig } from "@catalogue/shared/config/load-catalog-config";
import { useCatalogStore } from "@catalogue/shared/store/catalog-store";

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
