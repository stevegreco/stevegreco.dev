import assert from 'node:assert/strict'
import test from 'node:test'

import { installThemeRuntime } from '../src/lib/theme.ts'

function setup({
  stored,
  prefersDark,
}: {
  stored?: string
  prefersDark: boolean
}) {
  const storage = new Map<string, string>(stored ? [['theme', stored]] : [])
  const attributes = new Map<string, string>()
  const mediaListeners: Array<() => void> = []
  const media = {
    matches: prefersDark,
    addEventListener: (_: string, fn: () => void) => mediaListeners.push(fn),
  }

  Object.assign(globalThis, {
    window: { matchMedia: () => media },
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
    document: {
      documentElement: {
        setAttribute: (name: string, value: string) =>
          attributes.set(name, value),
        removeAttribute: (name: string) => attributes.delete(name),
      },
      addEventListener: () => {},
      dispatchEvent: () => true,
    },
  })

  installThemeRuntime()

  return {
    api: (globalThis as unknown as { window: Window }).window.__theme,
    storage,
    isDark: () => attributes.get('data-theme') === 'dark',
    changeOsPreference(dark: boolean) {
      media.matches = dark
      mediaListeners.forEach((fn) => fn())
    },
  }
}

test('follows the OS preference when nothing is stored', () => {
  assert.equal(setup({ prefersDark: true }).isDark(), true)
  assert.equal(setup({ prefersDark: false }).isDark(), false)
})

test('reacts to OS preference changes while on system', () => {
  const t = setup({ prefersDark: false })
  t.changeOsPreference(true)
  assert.equal(t.isDark(), true)
})

test('an explicit preference overrides the OS preference', () => {
  assert.equal(setup({ stored: 'dark', prefersDark: false }).isDark(), true)
  assert.equal(setup({ stored: 'light', prefersDark: true }).isDark(), false)
})

test('reads the legacy theme-light value as light', () => {
  const t = setup({ stored: 'theme-light', prefersDark: true })
  assert.equal(t.api.getPreference(), 'light')
  assert.equal(t.isDark(), false)
})

test('ignores unknown stored values', () => {
  assert.equal(
    setup({ stored: 'purple', prefersDark: true }).api.getPreference(),
    'system',
  )
})

test('setPreference persists and applies; system clears storage', () => {
  const t = setup({ prefersDark: false })
  t.api.setPreference('dark')
  assert.equal(t.storage.get('theme'), 'dark')
  assert.equal(t.isDark(), true)
  t.api.setPreference('system')
  assert.equal(t.storage.has('theme'), false)
  assert.equal(t.isDark(), false)
})
