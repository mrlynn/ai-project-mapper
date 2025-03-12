// test/commonjs.test.cjs
// Note: Using .cjs extension to force CommonJS mode

const test = require('node:test');
const assert = require('node:assert');

// A very simple test using CommonJS
test('simple test with CommonJS', () => {
  assert.strictEqual(1 + 1, 2);
  console.log('Simple CommonJS test passed!');
});