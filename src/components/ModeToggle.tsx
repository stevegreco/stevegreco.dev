import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { getTheme, setTheme } from '@/lib/theme'

import { Button } from '@/components/ui/button'

// Initialize theme immediately
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark =
    savedTheme === 'dark' || (savedTheme === 'system' && prefersDark)
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark')
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export function ModeToggle() {
  const [isDark, setIsDark] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Check initial theme state
    const theme = getTheme()
    setIsDark(theme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? 'theme-light' : 'dark'
    setTheme(newTheme)
    setIsDark(!isDark)
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button variant="outline" size="icon" onPress={toggleTheme}>
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-200" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
