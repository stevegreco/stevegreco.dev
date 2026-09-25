export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeApi {
  getPreference: () => ThemePreference
  getResolved: () => ResolvedTheme
  setPreference: (preference: ThemePreference) => void
}

declare global {
  interface Window {
    __theme: ThemeApi
  }
}

export const THEME_CHANGE_EVENT = 'theme-change'

// Serialized into an inline <head> script (see BaseHead.astro) so the theme is
// applied before first paint. It must stay self-contained: no references to
// imports or other module-level bindings.
export function installThemeRuntime() {
  const storageKey = 'theme'
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  function getPreference(): ThemePreference {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(storageKey)
    } catch {}
    if (stored === 'light' || stored === 'dark') return stored
    // Value written by the previous theme toggle.
    if (stored === 'theme-light') return 'light'
    return 'system'
  }

  function getResolved(): ResolvedTheme {
    const preference = getPreference()
    if (preference !== 'system') return preference
    return media.matches ? 'dark' : 'light'
  }

  function apply(root: HTMLElement = document.documentElement) {
    if (getResolved() === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }
  }

  function applyAndNotify() {
    apply()
    document.dispatchEvent(new CustomEvent('theme-change'))
  }

  function setPreference(preference: ThemePreference) {
    try {
      if (preference === 'system') {
        localStorage.removeItem(storageKey)
      } else {
        localStorage.setItem(storageKey, preference)
      }
    } catch {}
    applyAndNotify()
  }

  media.addEventListener('change', applyAndNotify)
  // View transitions swap in a fresh <html>; theme it before it is shown.
  document.addEventListener('astro:before-swap', (event) => {
    apply((event as Event & { newDocument: Document }).newDocument.documentElement)
  })

  window.__theme = { getPreference, getResolved, setPreference }
  apply()
}
