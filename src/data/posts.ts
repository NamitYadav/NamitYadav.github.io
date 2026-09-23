import { getCollection } from 'astro:content';

export const writingDescription = 'Notes on frontend engineering, migrations and leading teams.';

export async function getPublishedPosts() {
  return (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}
