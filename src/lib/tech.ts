export const TECH = ['typescript', 'astro'] as const

export type Tech = (typeof TECH)[number]
