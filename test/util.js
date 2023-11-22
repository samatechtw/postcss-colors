import postcss from 'postcss'
import { expect } from 'vitest'

import plugin from '../'

function runError(input, error) {
  const result = postcss([plugin()]).process(input, { from: '/test.css' })
  const warnings = result.warnings()
  expect(result.css).toEqual(input)
  expect(warnings).toHaveLength(1)
  expect(warnings[0].text).toEqual(error)
  return result
}

function run(input, output, opts) {
  const result = postcss([plugin(opts)]).process(input, { from: '/test.css' })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
  return result
}

module.exports = {
  runError,
  run,
}
