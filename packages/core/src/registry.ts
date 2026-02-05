import type { NormalizedStory } from "@catalogue-lab/plugin-api";

export class StoryRegistry {
  private stories = new Map<string, NormalizedStory>();

  setStories(stories: NormalizedStory[]) {
    this.stories.clear();
    for (const story of stories) {
      this.stories.set(story.id, story);
    }
  }

  getStory(id: string) {
    return this.stories.get(id);
  }

  getAllStories() {
    return Array.from(this.stories.values());
  }
}
