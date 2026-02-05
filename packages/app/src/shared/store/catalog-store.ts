import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StoriesIndex } from "@catalogue/plugin-api";

export type LayoutMode = "centered" | "padded" | "fullscreen";

export type ToolbarItemConfig = {
  id: string;
  label?: string;
  order?: number;
  icon?: string;
  shortcut?: string;
};

type CatalogState = {
  storiesIndex: StoriesIndex | null;
  selectedStoryId: string | null;
  globals: {
    theme: "light" | "dark";
    layout: LayoutMode;
  };
  toolbarConfig: ToolbarItemConfig[];
  uiState: {
    searchQuery: string;
    showGrid: boolean;
    showOutlines: boolean;
    showInfo: boolean;
    expandedGroups: string[];
  };
  remountCounter: number;
  setStoriesIndex: (index: StoriesIndex) => void;
  setSelectedStoryId: (id: string | null) => void;
  setSearchQuery: (value: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  setLayout: (layout: LayoutMode) => void;
  setToolbarConfig: (config: ToolbarItemConfig[]) => void;
  remountStory: () => void;
  toggleGrid: () => void;
  toggleOutlines: () => void;
  toggleInfo: () => void;
  toggleGroup: (groupId: string) => void;
};

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      storiesIndex: null,
      selectedStoryId: null,
      globals: {
        theme: "light",
        layout: "padded",
      },
      toolbarConfig: [],
      uiState: {
        searchQuery: "",
        showGrid: false,
        showOutlines: false,
        showInfo: false,
        expandedGroups: [],
      },
      remountCounter: 0,
      setStoriesIndex: (index) => set({ storiesIndex: index }),
      setSelectedStoryId: (id) => set({ selectedStoryId: id }),
      setSearchQuery: (value) =>
        set((state) => ({ uiState: { ...state.uiState, searchQuery: value } })),
      setTheme: (theme) => set((state) => ({ globals: { ...state.globals, theme } })),
      setLayout: (layout) =>
        set((state) => ({ globals: { ...state.globals, layout } })),
      setToolbarConfig: (config) => set({ toolbarConfig: config }),
      remountStory: () =>
        set((state) => ({ remountCounter: state.remountCounter + 1 })),
      toggleGrid: () =>
        set((state) => ({
          uiState: { ...state.uiState, showGrid: !state.uiState.showGrid },
        })),
      toggleOutlines: () =>
        set((state) => ({
          uiState: { ...state.uiState, showOutlines: !state.uiState.showOutlines },
        })),
      toggleInfo: () =>
        set((state) => ({
          uiState: { ...state.uiState, showInfo: !state.uiState.showInfo },
        })),
      toggleGroup: (groupId) =>
        set((state) => {
          const isEmpty = state.uiState.expandedGroups.length === 0;
          const expanded = isEmpty ? [] : state.uiState.expandedGroups;
          const exists = expanded.includes(groupId);
          const next = exists
            ? expanded.filter((id) => id !== groupId)
            : [...expanded, groupId];
          return { uiState: { ...state.uiState, expandedGroups: next } };
        }),
    }),
    {
      name: "catalog-store",
      partialize: (state) => ({
        globals: state.globals,
        toolbarConfig: state.toolbarConfig,
        uiState: {
          showGrid: state.uiState.showGrid,
          showOutlines: state.uiState.showOutlines,
          showInfo: state.uiState.showInfo,
          expandedGroups: state.uiState.expandedGroups,
        },
      }),
    }
  )
);
