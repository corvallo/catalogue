export const pluginApiVersion = "0.1.0";

export type PluginCapability = "toolbar" | "renderer" | "indexer" | "decorators";

export type PluginContext = {
  registerToolbarItems: (items: ToolbarItem[]) => void;
  registerRenderer: (renderer: RendererAdapter) => void;
  registerIndexer: (indexer: IndexerAdapter) => void;
  addGlobalDecorators: (decorators: Decorator[]) => void;
};

export type PluginManifest = {
  id: string;
  version: string;
  capabilities: PluginCapability[];
  apiVersion: string;
};

export type Plugin = {
  manifest: PluginManifest;
  init: (context: PluginContext) => void;
  dispose?: () => void;
};

export type ToolbarItem = {
  id: string;
  label: string;
  order?: number;
  icon?: unknown;
  shortcut?: string;
  onClick: () => void;
};

export type RendererAdapter = {
  id: string;
  framework: string;
  mount: (args: RendererMountArgs) => void;
  unmount: (args: RendererUnmountArgs) => void;
  remount?: (args: RendererMountArgs) => void;
};

export type RendererMountArgs = {
  story: NormalizedStory;
  container: HTMLElement;
  globals: Record<string, unknown>;
};

export type RendererUnmountArgs = {
  container: HTMLElement;
};

export type IndexerAdapter = {
  id: string;
  name: string;
  index: () => Promise<StoriesIndex>;
};

export type Decorator = (storyFn: () => unknown) => unknown;

export type StoryModuleMeta = {
  title: string;
  component?: unknown;
  args?: Record<string, unknown>;
  argTypes?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
  decorators?: Decorator[];
};

export type StoryExport = {
  args?: Record<string, unknown>;
  argTypes?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
  decorators?: Decorator[];
  render?: (args: Record<string, unknown>) => unknown;
  name?: string;
};

export type StoryModuleExports = Record<string, StoryExport>;

export type StoryModule = {
  default?: StoryModuleMeta;
  [key: string]: unknown;
};

export type NormalizedStory = {
  id: string;
  title: string;
  name: string;
  filePath: string;
  modulePath: string;
  componentPath?: string;
  args: Record<string, unknown>;
  argTypes: Record<string, unknown>;
  parameters: Record<string, unknown>;
  decorators: Decorator[];
  component?: unknown;
  render?: (args: Record<string, unknown>) => unknown;
};

export type StoriesIndex = {
  stories: NormalizedStory[];
  generatedAt: number;
};
