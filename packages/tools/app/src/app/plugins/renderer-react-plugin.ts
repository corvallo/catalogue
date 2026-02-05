import type { Plugin } from "@catalogue/plugin-api";
import { createReactRenderer } from "@catalogue/renderer-react";

export const createReactRendererPlugin = (): Plugin => {
  return {
    manifest: {
      id: "catalogue.renderer.react",
      version: "0.1.0",
      capabilities: ["renderer"],
      apiVersion: "0.1.0",
    },
    init: ({ registerRenderer }) => {
      registerRenderer(createReactRenderer());
    },
  };
};
