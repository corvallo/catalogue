import { pluginHost } from "@catalogue-lab/shared/plugin";
import { createToolbarBasePlugin } from "./toolbar-base-plugin";
import { createReactRendererPlugin } from "./renderer-react-plugin";
import { createViteIndexerPlugin } from "./indexer-vite-plugin";
import { createGeneratedIndexerPlugin } from "./indexer-generated-plugin";

pluginHost.init([
  createToolbarBasePlugin(),
  createReactRendererPlugin(),
  createViteIndexerPlugin(),
  createGeneratedIndexerPlugin(),
]);
