# stevegreco.dev

Personal site and writing, built with [Astro](https://astro.build) and
[Tailwind CSS](https://tailwindcss.com), deployed to Vercel. Design tokens come
from [`@stevegreco/design-system`](https://www.npmjs.com/package/@stevegreco/design-system).

## Development

```bash
pnpm install
pnpm dev      # start the dev server
pnpm check    # type-check .astro and .ts files
pnpm test     # run unit tests
pnpm build    # production build
```

## Content

- Blog posts: `src/content/blog/*.md` (`title`, `description`, `date`, `tags`)
- Projects: `src/content/projects/*.json`

Collections are defined in `src/content.config.ts`. Each post gets a generated
Open Graph image at `/blog/<id>.png`.
