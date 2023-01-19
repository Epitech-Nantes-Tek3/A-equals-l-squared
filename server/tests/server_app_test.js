const server_app = require('../server_app')
var assert = require('assert')

/**
 * A basic unit test for template.
 */
describe('Classic templated test', function () {
  it('should return 1', function () {
    assert.equal(server_app.test_example(1), 1)
  })
})
