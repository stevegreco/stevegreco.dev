const WORDS_PER_MINUTE = 250

export function getReadingTime(body = '') {
  const words = body.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
