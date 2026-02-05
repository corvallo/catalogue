import type { Plugin, ToolbarItem } from "@catalogue/plugin-api";
import { Copy, Grid2X2, Info, Moon, RefreshCw, SquareDashed } from "lucide-react";
import { useCatalogStore } from "@catalogue/shared/store";

const getToolbarItems = (): ToolbarItem[] => {
  return [
    {
      id: "theme.toggle",
      label: "Theme",
      icon: Moon,
      onClick: () => {
        const { globals, setTheme } = useCatalogStore.getState();
        setTheme(globals.theme === "light" ? "dark" : "light");
      },
    },
    {
      id: "story.remount",
      label: "Remount",
      icon: RefreshCw,
      onClick: () => {
        const { remountStory } = useCatalogStore.getState();
        remountStory();
      },
    },
    {
      id: "story.copyLink",
      label: "Copy Link",
      icon: Copy,
      onClick: async () => {
        if (!navigator.clipboard) return;
        await navigator.clipboard.writeText(window.location.href);
      },
    },
    {
      id: "canvas.grid",
      label: "Grid",
      icon: Grid2X2,
      onClick: () => {
        const { toggleGrid } = useCatalogStore.getState();
        toggleGrid();
      },
    },
    {
      id: "canvas.outlines",
      label: "Outlines",
      icon: SquareDashed,
      onClick: () => {
        const { toggleOutlines } = useCatalogStore.getState();
        toggleOutlines();
      },
    },
    {
      id: "story.info",
      label: "Info",
      icon: Info,
      onClick: () => {
        const { toggleInfo } = useCatalogStore.getState();
        toggleInfo();
      },
    },
  ];
};

export const createToolbarBasePlugin = (): Plugin => {
  return {
    manifest: {
      id: "catalogue.toolbar.base",
      version: "0.1.0",
      capabilities: ["toolbar"],
      apiVersion: "0.1.0",
    },
    init: ({ registerToolbarItems }) => {
      registerToolbarItems(getToolbarItems());
    },
  };
};
