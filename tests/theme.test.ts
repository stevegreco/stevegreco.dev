import assert from 'node:assert/strict'
import test from 'node:test'

import { isDarkTheme } from '../src/lib/theme.ts'

test('system theme follows a dark OS preference', () => {
  assert.equal(isDarkTheme('system', true), true)
})

test('system theme follows a light OS preference', () => {
  assert.equal(isDarkTheme('system', false), false)
})

test('explicit themes override the OS preference', () => {
  assert.equal(isDarkTheme('dark', false), true)
  assert.equal(isDarkTheme('theme-light', true), false)
})
