// test/simple.test.js
import { test } from 'node:test';
import assert from 'node:assert';

// A very simple test to verify the test runner works
test('simple test', () => {
  assert.strictEqual(1 + 1, 2);
  console.log('Simple test passed!');
});