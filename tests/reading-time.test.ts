import assert from 'node:assert/strict'
import test from 'node:test'

import { getReadingTime } from '../src/lib/reading-time.ts'

test('rounds up to whole minutes at 250 words per minute', () => {
  assert.equal(getReadingTime('word '.repeat(250)), 1)
  assert.equal(getReadingTime('word '.repeat(251)), 2)
})

test('never reports less than one minute', () => {
  assert.equal(getReadingTime(''), 1)
  assert.equal(getReadingTime(), 1)
})

test('ignores extra whitespace', () => {
  assert.equal(getReadingTime('  one\n\ntwo   three  '), 1)
})
