export const catalogConfig = {
  indexer: "vite" as "vite" | "generated",
  generatedIndexPath: "/src/stories-index",
  toolbar: [
    { id: "theme.toggle", label: "Theme", order: 1 },
    { id: "layout.toggle", label: "Layout", order: 2 },
    { id: "story.remount", label: "Remount", order: 3, shortcut: "R" },
    { id: "story.copyLink", label: "Copy Link", order: 4 },
    { id: "canvas.grid", label: "Grid", order: 5 },
    { id: "canvas.outlines", label: "Outlines", order: 6 },
    { id: "story.info", label: "Info", order: 7 },
  ],
};
