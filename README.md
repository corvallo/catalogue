# Catalogue

Internal UI component catalog and preview tool — a lightweight alternative to Storybook.

## Requirements

- Node >= 20
- pnpm (repo dev) / npm (external project tests)

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
pnpm -C packages/tools build &&
pnpm -C packages/app build
```

## Example app (in repo)

```
pnpm -C apps/example-app catalogue:dev
```

## External project (npm, local link)

### 1) Build and link tools from this repo

```
pnpm build
cd packages/tools
npm link
```

### 2) Link in the external project

```
cd /path/to/your-project
npm link @catalogue/tools
```

### 3) Initialize and run

```
npx catalogue init
npm run catalogue:dev
```

The catalog runs on http://localhost:8008 by default.

## Story format

Minimal inline component story example:

```tsx
import type { StoryModuleMeta } from "@catalogue/tools";

const InlineButton = ({ label }: { label: string }) => {
  return (
    <button type='button' style={{ padding: "8px 12px", borderRadius: 8 }}>
      {label}
    </button>
  );
};

const meta: StoryModuleMeta = {
  title: "Atoms/InlineButton",
  component: InlineButton,
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
