import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const componentPath = resolve('components/CorporateAccountOpeningForm.tsx');
const source = await readFile(componentPath, 'utf8');

function initialStateKeys() {
  const initialState = source.match(/const initialFormData = \{([\s\S]*?)\n\};/);
  assert.ok(initialState, 'initialFormData must be defined');
  return new Set([...initialState[1].matchAll(/^  ([A-Za-z][A-Za-z0-9_]*)\s*:/gm)].map((match) => match[1]));
}

test('every top-level corporate form field has an initial value', () => {
  const keys = initialStateKeys();
  const fields = new Set([...source.matchAll(/formData\.([A-Za-z][A-Za-z0-9_]*)/g)].map((match) => match[1]));
  const missing = [...fields].filter((field) => !keys.has(field));

  assert.deepEqual(missing, [], `Missing initial values: ${missing.join(', ')}`);
});

test('all standard field helpers preserve names and required validation', () => {
  for (const helper of ['InputRow', 'TextAreaRow', 'SelectRow']) {
    const start = source.indexOf(`const ${helper}`);
    const end = source.indexOf('\n});', start);
    const implementation = source.slice(start, end);

    assert.match(implementation, /name=\{name\}/, `${helper} must render its field name`);
    assert.match(implementation, /required=\{required\}/, `${helper} must pass required to the HTML control`);
  }
});

test('repeatable signatory and director rows declare all updated fields', () => {
  const keys = initialStateKeys();
  for (const section of ['accountSignatories', 'directorsDetails']) {
    const declaration = source.match(new RegExp(String.raw`${section}: \[\s*\{([\s\S]*?)\n    \},`));
    assert.ok(declaration, `${section} must have an initial row`);
    const rowKeys = new Set([...declaration[1].matchAll(/^      ([A-Za-z][A-Za-z0-9_]*)\s*:/gm)].map((match) => match[1]));
    const updated = new Set([...source.matchAll(new RegExp(`updateArrayItem\\('${section}', index, '([A-Za-z][A-Za-z0-9_]*)'`, 'g'))].map((match) => match[1]));
    const missing = [...updated].filter((field) => !rowKeys.has(field));
    assert.deepEqual(missing, [], `${section} fields missing initial values: ${missing.join(', ')}`);
  }

  assert.ok(keys.has('referenceForm'), 'referenceForm upload must have initial state');
});
