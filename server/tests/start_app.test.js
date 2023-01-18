const server_app = require('../server_app.js')

test('test_example', () => {
  expect(server_app.test_example('1')).toBe(1)
})
