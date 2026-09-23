import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, writingDescription } from '../data/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: 'Namit Yadav · Writing',
    description: writingDescription,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.description,
      link: `/writing/${p.id}/`,
    })),
  });
}
