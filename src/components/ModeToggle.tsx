import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { setTheme } from '@/lib/theme'

import { Button } from '@/components/ui/button'

export function ModeToggle() {
  const [isDark, setIsDark] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.dataset.theme === 'dark')
  }, [])

  const toggleTheme = () => {
    const currentlyDark = document.documentElement.dataset.theme === 'dark'
    const newTheme = currentlyDark ? 'theme-light' : 'dark'
    setTheme(newTheme)
    setIsDark(!currentlyDark)
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
