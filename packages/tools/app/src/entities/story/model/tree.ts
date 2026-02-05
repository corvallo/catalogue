export type TreeNode = {
  id: string;
  name: string;
  children: TreeNode[];
  stories: Array<{ id: string; name: string; title: string }>;
};

export type StoryRef = { id: string; name: string; title: string };

type SortMode = "alpha" | "natural";

export type TreeSortOptions = {
  groupOrder?: string[];
  storySort?: SortMode;
};

export const buildTree = (stories: StoryRef[]): TreeNode => {
  const root: TreeNode = { id: "root", name: "root", children: [], stories: [] };
  const getOrCreate = (parent: TreeNode, name: string) => {
    let node = parent.children.find((child) => child.name === name);
    if (!node) {
      node = { id: `${parent.id}/${name}`, name, children: [], stories: [] };
      parent.children.push(node);
    }
    return node;
  };

  for (const story of stories) {
    const segments = story.title.split("/").map((segment) => segment.trim());
    let current = root;
    for (const segment of segments) {
      current = getOrCreate(current, segment);
    }
    current.stories.push(story);
  }

  return root;
};

export const filterTree = (node: TreeNode, query: string): TreeNode | null => {
  const lower = query.toLowerCase();
  const storyMatches = node.stories.filter(
    (story) =>
      story.name.toLowerCase().includes(lower) ||
      story.title.toLowerCase().includes(lower)
  );
  const childMatches = node.children
    .map((child) => filterTree(child, query))
    .filter((child): child is TreeNode => Boolean(child));

  if (storyMatches.length || childMatches.length) {
    return {
      ...node,
      stories: storyMatches,
      children: childMatches,
    };
  }
  return null;
};

const compareText = (a: string, b: string, mode: SortMode) => {
  if (mode === "natural") {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  }
  return a.localeCompare(b, undefined, { sensitivity: "base" });
};

const buildOrderMap = (order: string[] | undefined) => {
  if (!order?.length) return null;
  return new Map(order.map((name, index) => [name.toLowerCase(), index]));
};

export const sortTree = (
  node: TreeNode,
  options: TreeSortOptions = {},
  depth = 0
): TreeNode => {
  const storySort = options.storySort ?? "alpha";
  const orderMap = depth === 0 ? buildOrderMap(options.groupOrder) : null;

  const sortedStories = [...node.stories].sort((a, b) =>
    compareText(a.name, b.name, storySort)
  );

  const sortedChildren = [...node.children]
    .map((child) => sortTree(child, options, depth + 1))
    .sort((a, b) => {
      if (orderMap) {
        const aRank = orderMap.get(a.name.toLowerCase());
        const bRank = orderMap.get(b.name.toLowerCase());
        if (aRank !== undefined || bRank !== undefined) {
          return (aRank ?? Number.MAX_SAFE_INTEGER) - (bRank ?? Number.MAX_SAFE_INTEGER);
        }
      }
      return compareText(a.name, b.name, "alpha");
    });

  return {
    ...node,
    stories: sortedStories,
    children: sortedChildren,
  };
};
