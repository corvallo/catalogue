import { useEffect, useMemo, useRef } from "react";
import type { NormalizedStory } from "@catalogue/plugin-api";
import { pluginHost } from "@catalogue/shared/plugin";
import { ReactStory } from "@catalogue/renderer-react";

type StoryCanvasProps = {
  story: NormalizedStory | null;
  globals: Record<string, unknown>;
  remountCounter: number;
};

type NonReactCanvasProps = StoryCanvasProps & {
  renderer: NonNullable<ReturnType<typeof pluginHost.getRenderer>>;
};

const NonReactStoryCanvas = ({ story, globals, remountCounter, renderer }: NonReactCanvasProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastRemount = useRef(remountCounter);
  const lastStoryId = useRef<string | null>(null);
  const globalsRef = useRef(globals);

  useEffect(() => {
    globalsRef.current = globals;
  }, [globals]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!story) return;
    const storyChanged = lastStoryId.current !== story.id;
    const shouldRemount = lastRemount.current !== remountCounter;
    if (!storyChanged && !shouldRemount) return;

    lastStoryId.current = story.id;

    if (shouldRemount) {
      lastRemount.current = remountCounter;
      if (renderer.remount) {
        renderer.remount({ story, container: containerRef.current, globals: globalsRef.current });
        return;
      }
      renderer.unmount({ container: containerRef.current });
      queueMicrotask(() => {
        if (!containerRef.current) return;
        renderer.mount({
          story,
          container: containerRef.current,
          globals: globalsRef.current,
        });
      });
      return;
    }

    renderer.mount({ story, container: containerRef.current, globals: globalsRef.current });
  }, [story?.id, renderer, remountCounter]);

  useEffect(() => {
    return () => {
      if (!containerRef.current) return;
      renderer.unmount({ container: containerRef.current });
    };
  }, [renderer]);

  return <div ref={containerRef} style={{ minHeight: 240 }} />;
};

export const StoryCanvas = ({ story, globals, remountCounter }: StoryCanvasProps) => {
  const renderer = useMemo(() => pluginHost.getRenderer("react"), []);

  if (!renderer) {
    return <div>Renderer not available.</div>;
  }

  if (renderer.framework === "react" && story) {
    return <ReactStory key={`${story.id}:${remountCounter}`} story={story} />;
  }

  return (
    <NonReactStoryCanvas
      renderer={renderer}
      story={story}
      globals={globals}
      remountCounter={remountCounter}
    />
  );
};
