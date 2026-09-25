import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      date: z.coerce.date(),
      image: image().optional(),
      tags: z.array(z.string()).default([]),
    }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    repo_url: z.url(),
  }),
})

export const collections = { blog, projects }
