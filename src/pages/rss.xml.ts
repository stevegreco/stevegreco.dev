import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { getSortedPosts } from '@/lib/blog'

export const GET: APIRoute = async (context) => {
  const posts = await getSortedPosts()

  return rss({
    title: 'Steve Greco - Writing',
    description:
      'Thoughts on Design Systems, AI, and the craft of building software.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
  })
}
