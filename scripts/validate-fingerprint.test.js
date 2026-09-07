#!/usr/bin/env node
'use strict';

// Pruebas del FINGERPRINT canónico de la tubería de cierre (quality-check,
// code-review, trace-validate). Node built-in test runner + assert, sin
// dependencias externas; necesita `git` y `bash` en el PATH. Ejecutar con:
//   node --test scripts/validate-fingerprint.test.js
//
// Qué verifica:
//   1. Que la receta (`EXC=` + `FINGERPRINT=`) sea idéntica en los tres archivos
//      que la copian: skills/quality-check/references/execution.md (canónica),
//      skills/code-review/references/execution.md y
//      skills/trace-validate/references/flow.md.
//   2. Que, ejecutada sobre un repo real, la clave se mueva SOLO cuando cambia
//      algo que puede alterar el resultado de una prueba o de una compilación:
//      código, tests, manifiestos y configuración visible de la raíz. Editar
//      documentación (*.md, LICENSE, CHANGELOG, docs/**), el .gitignore o el
//      contenido de carpetas ocultas NO debe invalidar la caché de test-run.json.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const RECIPE_FILES = [
  'skills/quality-check/references/execution.md', // canónica
  'skills/code-review/references/execution.md',
  'skills/trace-validate/references/flow.md',
];

// --- 1. Extraer la receta de cada archivo ------------------------------------

function extractRecipe(file) {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const lines = content.split('\n');
  const start = lines.findIndex((l) => /^\s*EXC=\(/.test(l));
  assert.notEqual(start, -1, `${file}: no se encontró la línea EXC=(`);
  const end = lines.findIndex((l, i) => i >= start && /hash-object --stdin \)/.test(l));
  assert.notEqual(end, -1, `${file}: no se encontró el cierre de FINGERPRINT`);
  // Normalizar la indentación: cada copia vive con distinto sangrado.
  return lines
    .slice(start, end + 1)
    .map((l) => l.replace(/^\s+/, ''))
    .join('\n');
}

test('la receta del FINGERPRINT es idéntica en sus tres copias', () => {
  const [canonical, ...copies] = RECIPE_FILES.map(extractRecipe);
  for (let i = 0; i < copies.length; i++) {
    assert.equal(
      copies[i],
      canonical,
      `${RECIPE_FILES[i + 1]} difiere de la receta canónica de ${RECIPE_FILES[0]}`,
    );
  }
});

test('la receta excluye documentación y .gitignore, y conserva la configuración visible', () => {
  const recipe = extractRecipe(RECIPE_FILES[0]);
  for (const pattern of ['**/.*/**', '**/docs/**', '**/*.md', '**/LICENSE*', '**/CHANGELOG*', '**/.gitignore']) {
    assert.ok(recipe.includes(`':(top,exclude,glob)${pattern}'`), `falta la exclusión ${pattern}`);
  }
  // Estas NO deben excluirse: cambian el resultado de una prueba o de un build.
  for (const forbidden of ['**/*.txt', '**/*.mdx', '**/*.json', '**/.*']) {
    assert.ok(!recipe.includes(`':(top,exclude,glob)${forbidden}'`), `${forbidden} no debe excluirse`);
  }
  assert.ok(!/rev-parse HEAD/.test(recipe), 'la receta no debe referenciar HEAD');
  assert.ok(/-uall/.test(recipe), 'status necesita -uall');
  assert.ok(/git -C "\$ROOT"/.test(recipe), 'los comandos deben anclarse a la raíz con git -C');
});

// --- 2. Ejecutar la receta sobre un repo real ---------------------------------

const hasTools = ['git', 'bash'].every(
  (bin) => spawnSync(bin, ['--version'], { stdio: 'ignore' }).status === 0,
);

function makeRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sdd-fp-'));
  const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: 'pipe' });
  git('init', '-q');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'test');
  git('config', 'commit.gpgsign', 'false');
  const write = (rel, content) => {
    const p = path.join(dir, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  };
  write('src/a.ts', 'export const a = 1;\n');
  write('src/NOTES.md', '# notas\n');
  write('package.json', '{"name":"x"}\n');
  write('README.md', '# readme\n');
  write('CHANGELOG.md', '# cl\n');
  write('LICENSE', 'MIT\n');
  write('docs/spec.md', '# spec\n');
  write('.gitignore', 'node_modules\n');
  git('add', '-A');
  git('commit', '-q', '-m', 'init');
  return { dir, git, write };
}

function fingerprint(recipe, cwd) {
  const script = `set -e\nROOT=$( git rev-parse --show-toplevel )\n${recipe}\necho "$FINGERPRINT"`;
  return execFileSync('bash', ['-c', script], { cwd, encoding: 'utf8' }).trim();
}

test('la clave se mueve solo cuando cambia el código', { skip: !hasTools && 'git/bash no disponibles' }, (t) => {
  const recipe = extractRecipe(RECIPE_FILES[0]);
  const { dir, git, write } = makeRepo();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const base = fingerprint(recipe, dir);
  assert.match(base, /^[0-9a-f]{40}$/);

  const rm = (rel) => fs.rmSync(path.join(dir, rel), { recursive: true, force: true });
  const restore = () => { git('checkout', '-q', '--', '.'); git('clean', '-qfd'); };

  // No deben mover la clave: no afectan a pruebas ni a compilación.
  const stable = [
    ['README.md editado', () => write('README.md', '# readme v2\n')],
    ['src/NOTES.md editado (md dentro del código)', () => write('src/NOTES.md', 'otra nota\n')],
    ['CHANGELOG.md editado', () => write('CHANGELOG.md', '# cl v2\n')],
    ['LICENSE editado', () => write('LICENSE', 'MIT v2\n')],
    ['docs/nuevo.md sin trackear', () => write('docs/nuevo.md', 'x\n')],
    ['packages/api/docs/a.md (docs anidado)', () => write('packages/api/docs/a.md', 'x\n')],
    ['src/nuevo.md sin trackear', () => write('src/nuevo.md', 'x\n')],
    ['coverage.md junto a un artefacto externo', () => write('specs/US-1/coverage.md', 'x\n')],
    ['.gitignore editado', () => write('.gitignore', 'node_modules\ndist\n')],
    ['.sdd-devkit/test-run.json escrito', () => write('.sdd-devkit/test-run.json', '{}\n')],
    ['.github/wf.yml (carpeta oculta)', () => write('.github/wf.yml', 'x\n')],
  ];
  for (const [name, mutate] of stable) {
    mutate();
    assert.equal(fingerprint(recipe, dir), base, `"${name}" desplazó la clave y no debía`);
    restore();
  }

  // Sí deben mover la clave.
  const moving = [
    ['src/a.ts editado', () => write('src/a.ts', 'export const a = 2;\n')],
    ['src/b.ts sin trackear', () => write('src/b.ts', 'export const b = 1;\n')],
    ['package.json editado (manifiesto)', () => write('package.json', '{"name":"y"}\n')],
    ['requirements.txt nuevo (manifiesto .txt)', () => write('requirements.txt', 'pytest\n')],
    ['.eslintrc.json nuevo (oculto de la raíz)', () => write('.eslintrc.json', '{}\n')],
    ['src/page.mdx nuevo (MDX es código)', () => write('src/page.mdx', '# x\n')],
    ['src/a.ts borrado', () => rm('src/a.ts')],
  ];
  for (const [name, mutate] of moving) {
    mutate();
    assert.notEqual(fingerprint(recipe, dir), base, `"${name}" no desplazó la clave y debía`);
    restore();
  }

  // Un commit que solo toca documentación tampoco la mueve (la receta no usa HEAD).
  write('README.md', '# readme v3\n');
  git('add', '-A');
  git('commit', '-q', '-m', 'docs only');
  assert.equal(fingerprint(recipe, dir), base, 'un commit solo de docs desplazó la clave');

  // Y es la misma desde cualquier subdirectorio (git -C "$ROOT" + :(top)).
  fs.mkdirSync(path.join(dir, 'packages/api'), { recursive: true });
  assert.equal(fingerprint(recipe, path.join(dir, 'packages/api')), base, 'la clave depende del cwd');
});

test('workingTreeClean usa los mismos pathspecs: la documentación sucia no ensucia el árbol',
  { skip: !hasTools && 'git/bash no disponibles' }, (t) => {
    const recipe = extractRecipe(RECIPE_FILES[0]);
    const excOnly = recipe.split('\n').filter((l) => !/FINGERPRINT=|git -C|hash-object/.test(l)).join('\n');
    const { dir, write } = makeRepo();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
    write('README.md', '# sucio\n');
    write('docs/x.md', 'x\n');
    const script = `set -e\nROOT=$( git rev-parse --show-toplevel )\n${excOnly}\ngit -C "$ROOT" status --porcelain -uall -- "\${EXC[@]}"`;
    const out = execFileSync('bash', ['-c', script], { cwd: dir, encoding: 'utf8' });
    assert.equal(out.trim(), '', 'documentación sin commitear no debe contar como working tree sucio');
  });
