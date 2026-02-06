# Catalogue

Internal UI component catalog and preview tool — a lightweight alternative to Storybook.

## Requirements

- Node >= 20

## Monorepo quickstart

```
pnpm install
pnpm build
```

If you want a manual build order:

```
pnpm -C packages/plugin-api build &&
pnpm -C packages/core build &&
pnpm -C packages/indexer-generated build &&
pnpm -C packages/indexer-vite build &&
pnpm -C packages/renderer-react build &&
pnpm -C packages/cli build &&
pnpm -C packages/catalogue build &&
pnpm -C packages/app build
```

## How to install

```
npm i -D @catalogue-lab/catalogue
npx catalogue init
npm run catalogue:dev
```

The catalog runs on http://localhost:8008 by default.

To use a different port:

```
CATALOGUE_PORT=9000 npm run catalogue:dev
```

## What it does today

- React story rendering
- Story discovery via generated index (auto on `catalogue:dev`)
- Sidebar tree with grouping and search
- Toolbar actions (theme, remount, copy link, grid, outlines, info)
- Story info panel (id, title, file path, component path)
- Deep links to stories

## Not yet

- Other renderers (Svelte/Vue/Web Components)
- Additional panels/add-ons
- Advanced theming/decorators UI
- Visual regression/testing

## Story format

Minimal inline component story example:

```tsx
import type { StoryModuleMeta } from "@catalogue-lab/catalogue";

const Button = ({ label }: { label: string }) => {
  return (
    <button type='button' style={{ padding: "8px 12px", borderRadius: 8 }}>
      {label}
    </button>
  );
};

const meta: StoryModuleMeta = {
  title: "Atoms/Button",
  component: Button,
  args: { label: "Click me" },
  parameters: {
    componentPath: "src/stories/inline-button.stories.tsx",
  },
};

export default meta;
export const Default = {};
```

## Config

`catalogue init` creates `catalog.config.ts` with the default story paths:

```ts
export const catalogConfig = {
  stories: ["src/**/*.stories.tsx"],
  toolbar: [],
};
```

## Releases (Changesets)

Create a changeset:

```
pnpm changeset
```

Version packages:

```
pnpm version
```

Publish (on master):

```
pnpm verify:publish
pnpm publish
```

## Example app (optional)

If you want to test the example app included in the repo:

```
pnpm -C apps/example-app catalogue:dev
```
