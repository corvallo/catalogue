import type { StoryModuleMeta } from "@catalogue/tools/plugin-api";
import { InfoCard } from "../components/info-card";

const meta: StoryModuleMeta = {
  title: "Molecules/InfoCard",
  component: InfoCard,
  args: {
    title: "Release candidate",
    description: "This is a short card description used in the example app.",
  },
  parameters: {
    componentPath: "src/components/info-card.tsx",
  },
};

export default meta;

export const Default = {};
