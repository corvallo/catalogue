import type {
  Decorator,
  IndexerAdapter,
  Plugin,
  PluginContext,
  RendererAdapter,
  ToolbarItem,
} from "@catalogue-lab/plugin-api";

export class PluginHost {
  private toolbarItems = new Map<string, ToolbarItem>();
  private renderers = new Map<string, RendererAdapter>();
  private indexers = new Map<string, IndexerAdapter>();
  private globalDecorators: Decorator[] = [];
  private plugins: Plugin[] = [];

  init(plugins: Plugin[]) {
    this.plugins = plugins;
    for (const plugin of plugins) {
      plugin.init(this.getContext());
    }
  }

  dispose() {
    for (const plugin of this.plugins) {
      plugin.dispose?.();
    }
  }

  getToolbarItems() {
    return Array.from(this.toolbarItems.values()).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
  }

  getRenderer(id: string) {
    return this.renderers.get(id);
  }

  getIndexers() {
    return Array.from(this.indexers.values());
  }

  getGlobalDecorators() {
    return this.globalDecorators;
  }

  private getContext(): PluginContext {
    return {
      registerToolbarItems: (items) => {
        for (const item of items) {
          this.toolbarItems.set(item.id, item);
        }
      },
      registerRenderer: (renderer) => {
        this.renderers.set(renderer.id, renderer);
      },
      registerIndexer: (indexer) => {
        this.indexers.set(indexer.id, indexer);
      },
      addGlobalDecorators: (decorators) => {
        this.globalDecorators.push(...decorators);
      },
    };
  }
}
