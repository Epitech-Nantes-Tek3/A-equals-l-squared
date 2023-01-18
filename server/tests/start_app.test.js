const server_app = require('../server_app')

/**
 * A basic unit test for template.
 */
test('test_example', () => {
  expect(server_app.test_example(1)).toBe(1)
})
