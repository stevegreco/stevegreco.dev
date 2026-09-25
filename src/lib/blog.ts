import { getCollection } from 'astro:content'

export async function getSortedPosts() {
  const posts = await getCollection('blog')
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export function getReadingTime(body = '') {
  const words = body.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 250))
}
