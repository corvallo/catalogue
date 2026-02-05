import { pluginHost } from "@catalogue/shared/plugin/plugin-host";
import { createToolbarBasePlugin } from "./plugins/toolbar-base-plugin";
import { createReactRendererPlugin } from "./plugins/renderer-react-plugin";
import { createViteIndexerPlugin } from "./plugins/indexer-vite-plugin";
import { createGeneratedIndexerPlugin } from "./plugins/indexer-generated-plugin";

pluginHost.init([
  createToolbarBasePlugin(),
  createReactRendererPlugin(),
  createViteIndexerPlugin(),
  createGeneratedIndexerPlugin(),
]);
