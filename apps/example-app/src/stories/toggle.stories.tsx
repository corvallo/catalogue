import { useState } from "react";
import type { StoryModuleMeta } from "@catalogue-lab/catalogue";
import { Toggle } from "../components/toggle";

const meta: StoryModuleMeta = {
  title: "Atoms/Toggle",
  component: Toggle,
  args: {
    label: "Enable motion",
    checked: true,
  },
  parameters: {
    componentPath: "src/components/toggle.tsx",
  },
};

export default meta;

const Interactive = (args: { label: string; checked: boolean }) => {
  const [checked, setChecked] = useState(args.checked);
  return <Toggle {...args} checked={checked} onChange={setChecked} />;
};

export const Default = {
  render: (args: { label: string; checked: boolean }) => <Interactive {...args} />,
};
