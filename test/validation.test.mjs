import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize, escapeHtml } from '../src/validation.js';
test('counts repeated actions as occurrences and keeps session totals separate', () => {
  const result = summarize([{name:'checkout_started',session:'a'}, {name:'checkout_started',session:'a'}, {name:'checkout_started',session:'b'}]);
  assert.deepEqual(result.checkout_started, {occurrences:3, sessions:2});
});
test('escapes user text for HTML rendering', () => assert.equal(escapeHtml('<img src=x>'), '&lt;img src=x&gt;'));
