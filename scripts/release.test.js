'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { bump, replaceVersion } = require('./release.js');

test('bump: major, minor y patch reinician los niveles inferiores', () => {
  assert.strictEqual(bump('2.2.8', 'patch'), '2.2.9');
  assert.strictEqual(bump('2.2.8', 'minor'), '2.3.0');
  assert.strictEqual(bump('2.2.8', 'major'), '3.0.0');
});

test('bump: rechaza versiones que no son semver', () => {
  assert.throws(() => bump('2.2', 'patch'));
});

test('replaceVersion: conserva el formato y respeta el ancla', () => {
  const text = '{\n  "plugins": [\n    { "name": "a", "version": "1.0.0" },\n    { "name": "b", "version": "2.2.8" }\n  ]\n}\n';
  const out = replaceVersion(text, '2.2.8', '2.3.0', 'b');
  assert.strictEqual(out, text.replace('"2.2.8"', '"2.3.0"'));
});

test('replaceVersion: falla si la version esperada no coincide', () => {
  assert.throws(() => replaceVersion('{"version": "1.0.0"}', '2.2.8', '2.2.9'));
});
