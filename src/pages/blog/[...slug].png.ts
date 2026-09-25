import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'
import { renderOGImage } from '@/lib/og-image'

export const getStaticPaths = (async () => {
  return (await getCollection('blog')).map((post) => ({
    params: { slug: post.id },
    props: { post },
  }))
}) satisfies GetStaticPaths

export const GET: APIRoute<{ post: CollectionEntry<'blog'> }> = async ({ props }) => {
  const png = await renderOGImage(props.post.data.title)

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  })
}
