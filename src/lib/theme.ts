export type Theme = 'theme-light' | 'dark' | 'system'

export function isDarkTheme(theme: Theme, prefersDark: boolean) {
  return theme === 'dark' || (theme === 'system' && prefersDark)
}

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'theme-light'
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) return savedTheme as Theme
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'theme-light'
}

export function setTheme(theme: Theme) {
  if (typeof window === 'undefined') return
  localStorage.setItem('theme', theme)
  const isDark = isDarkTheme(
    theme,
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark')
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export function initializeTheme() {
  if (typeof window === 'undefined') return
  const theme = getTheme()
  setTheme(theme)
}
