import React from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import type {
  NormalizedStory,
  RendererAdapter,
  RendererMountArgs,
  RendererUnmountArgs,
} from "@catalogue-lab/plugin-api";

const renderStory = (story: NormalizedStory): React.ReactNode => {
  if (story.render) {
    return story.render(story.args) as React.ReactNode;
  }
  if (story.component) {
    return React.createElement(story.component as React.ElementType, story.args);
  }
  return React.createElement("div", null, "No render function or component.");
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message?: string }
> {
  state = { hasError: false, message: undefined as string | undefined };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  render() {
    if (this.state.hasError) {
      return React.createElement(
        "div",
        { style: { padding: 16, color: "#8b3b2b" } },
        this.state.message ?? "Story render failed"
      );
    }
    return this.props.children;
  }
}

export const ReactStory = ({ story }: { story: NormalizedStory }) => {
  return React.createElement(ErrorBoundary, null, renderStory(story));
};

export const createReactRenderer = (): RendererAdapter => {
  const roots = new WeakMap<HTMLElement, Root>();

  const mount = ({ story, container }: RendererMountArgs) => {
    const root = roots.get(container) ?? createRoot(container);
    roots.set(container, root);
    root.render(React.createElement(ErrorBoundary, null, renderStory(story)));
  };

  const unmount = ({ container }: RendererUnmountArgs) => {
    const root = roots.get(container);
    if (root) {
      root.unmount();
      roots.delete(container);
    }
  };

  return {
    id: "react",
    framework: "react",
    mount,
    unmount,
    remount: mount,
  };
};
