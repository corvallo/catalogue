import type {
  Decorator,
  NormalizedStory,
  StoryExport,
  StoryModuleMeta,
  StoriesIndex,
} from "@catalogue-lab/plugin-api";

export type GlobalStoryConfig = {
  args?: Record<string, unknown>;
  argTypes?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
  decorators?: Decorator[];
};

export const createStoryId = (filePath: string, exportName: string) => {
  return `${filePath}::${exportName}`;
};

export const normalizeStoryModule = (options: {
  modulePath: string;
  filePath: string;
  meta?: StoryModuleMeta;
  stories: Record<string, StoryExport>;
  global?: GlobalStoryConfig;
}): NormalizedStory[] => {
  const { modulePath, filePath, meta, stories, global } = options;
  const metaArgs = meta?.args ?? {};
  const metaArgTypes = meta?.argTypes ?? {};
  const metaParameters = meta?.parameters ?? {};
  const metaDecorators = meta?.decorators ?? [];
  const globalArgs = global?.args ?? {};
  const globalArgTypes = global?.argTypes ?? {};
  const globalParameters = global?.parameters ?? {};
  const globalDecorators = global?.decorators ?? [];

  return Object.entries(stories).map(([exportName, story]) => {
    const name = story.name ?? exportName;
    const componentPath =
      typeof meta?.parameters?.componentPath === "string" ? meta.parameters.componentPath : undefined;
    return {
      id: createStoryId(filePath, exportName),
      title: meta?.title ?? "",
      name,
      filePath,
      modulePath,
      componentPath,
      args: { ...globalArgs, ...metaArgs, ...story.args },
      argTypes: { ...globalArgTypes, ...metaArgTypes, ...story.argTypes },
      parameters: { ...globalParameters, ...metaParameters, ...story.parameters },
      decorators: [...globalDecorators, ...metaDecorators, ...(story.decorators ?? [])],
      component: meta?.component,
      render: story.render,
    };
  });
};

export const createStoriesIndex = (stories: NormalizedStory[]): StoriesIndex => {
  return {
    stories,
    generatedAt: Date.now(),
  };
};
