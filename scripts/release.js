#!/usr/bin/env node
'use strict';

// Publica una version de sdd-devkit: sube la version (major | minor | patch) en
// el plugin de Claude (.claude-plugin/plugin.json y su entrada en marketplace.json),
// en el plugin de Cursor (plugin.json) y en el badge del README; commitea el bump,
// publica develop, abre el PR develop -> main, lo mergea y crea el release en GitHub.
// Sin dependencias externas: solo modulos nativos de Node.js, git y gh.
//
// Uso: node scripts/release.js <major|minor|patch> [--dry-run] [--no-publish]
//   --dry-run     muestra lo que haria sin modificar archivos ni ejecutar git/gh.
//   --no-publish  sube la version y la commitea, pero no hace push, PR ni release.
// Codigo de salida: 0 en exito, 1 ante cualquier error.

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_BRANCH = 'develop';
const TARGET_BRANCH = 'main';
const PLUGIN_NAME = 'sdd-devkit';
const KINDS = ['major', 'minor', 'patch'];
const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)$/;
const BADGE_RE = /(img\.shields\.io\/badge\/version-)\d+\.\d+\.\d+(-blue)/;

function bump(version, kind) {
  const m = SEMVER_RE.exec(version);
  if (!m) throw new Error(`Version no semver: ${version}`);
  const [major, minor, patch] = m.slice(1).map(Number);
  if (kind === 'major') return `${major + 1}.0.0`;
  if (kind === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

// Sustituye el primer "version" de un JSON conservando su formato; si se pasa
// `anchor`, solo dentro del objeto que sigue a `"name": "<anchor>"`.
function replaceVersion(text, from, to, anchor) {
  const re = /("version"\s*:\s*")(\d+\.\d+\.\d+)(")/;
  let start = 0;
  if (anchor) {
    start = text.search(new RegExp(`"name"\\s*:\\s*"${anchor}"`));
    if (start === -1) throw new Error(`No se encontro "${anchor}"`);
  }
  const head = text.slice(0, start);
  const tail = text.slice(start);
  const m = re.exec(tail);
  if (!m || m[2] !== from) {
    throw new Error(`La version esperada ${from} no coincide (${m ? m[2] : 'sin version'})`);
  }
  return head + tail.replace(re, `$1${to}$3`);
}

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...opts }).trim();
}

function main() {
  const args = process.argv.slice(2);
  const kind = args.find((a) => KINDS.includes(a));
  const dryRun = args.includes('--dry-run');
  const publish = !args.includes('--no-publish');
  if (!kind || args.some((a) => !KINDS.includes(a) && !a.startsWith('--'))) {
    console.error('Uso: node scripts/release.js <major|minor|patch> [--dry-run] [--no-publish]');
    process.exit(1);
  }

  const files = {
    claude: path.join(ROOT, '.claude-plugin', 'plugin.json'),
    marketplace: path.join(ROOT, '.claude-plugin', 'marketplace.json'),
    cursor: path.join(ROOT, 'plugin.json'),
    readme: path.join(ROOT, 'README.md'),
  };
  const current = JSON.parse(fs.readFileSync(files.claude, 'utf8')).version;
  const next = bump(current, kind);
  const tag = `v${next}`;

  // Las versiones de los tres manifiestos y del badge deben partir alineadas.
  const cursorVersion = JSON.parse(fs.readFileSync(files.cursor, 'utf8')).version;
  const market = JSON.parse(fs.readFileSync(files.marketplace, 'utf8'));
  const marketVersion = market.plugins.find((p) => p.name === PLUGIN_NAME).version;
  const badge = BADGE_RE.exec(fs.readFileSync(files.readme, 'utf8'));
  if (!badge) throw new Error('No se encontro el badge de version en README.md');
  const badgeVersion = /version-(\d+\.\d+\.\d+)-/.exec(badge[0])[1];
  const misaligned = Object.entries({ cursor: cursorVersion, marketplace: marketVersion, readme: badgeVersion })
    .filter(([, v]) => v !== current);
  if (misaligned.length) {
    throw new Error(`Versiones desalineadas con ${current}: ${misaligned.map(([k, v]) => `${k}=${v}`).join(', ')}`);
  }

  console.log(`${PLUGIN_NAME}: ${current} -> ${next} (${kind})`);
  if (dryRun) {
    console.log(`[dry-run] actualizaria ${Object.values(files).map((f) => path.relative(ROOT, f)).join(', ')}`);
    console.log(`[dry-run] ${publish ? `push ${SOURCE_BRANCH}, PR ${SOURCE_BRANCH} -> ${TARGET_BRANCH}, merge y release ${tag}` : 'sin publicar (--no-publish)'}`);
    return;
  }

  // Precondiciones: rama de origen, arbol limpio y, al publicar, gh disponible.
  const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  if (branch !== SOURCE_BRANCH) throw new Error(`Se debe publicar desde ${SOURCE_BRANCH} (rama actual: ${branch})`);
  if (run('git', ['status', '--porcelain', '--untracked-files=no'])) {
    throw new Error('El working tree tiene cambios sin commitear: commitealos antes de publicar');
  }
  if (publish) {
    run('gh', ['--version']);
    run('git', ['fetch', 'origin']);
    if (run('git', ['tag', '--list', tag])) throw new Error(`El tag ${tag} ya existe`);
  }

  // Validaciones del repo antes de tocar nada.
  execFileSync('node', ['scripts/validate-skills.js'], { cwd: ROOT, stdio: 'inherit' });
  execFileSync('node', ['--test', ...fs.readdirSync(path.join(ROOT, 'scripts')).filter((f) => f.endsWith('.test.js')).map((f) => `scripts/${f}`)], { cwd: ROOT, stdio: 'inherit' });

  fs.writeFileSync(files.claude, replaceVersion(fs.readFileSync(files.claude, 'utf8'), current, next));
  fs.writeFileSync(files.cursor, replaceVersion(fs.readFileSync(files.cursor, 'utf8'), current, next));
  fs.writeFileSync(files.marketplace, replaceVersion(fs.readFileSync(files.marketplace, 'utf8'), current, next, PLUGIN_NAME));
  fs.writeFileSync(files.readme, fs.readFileSync(files.readme, 'utf8').replace(BADGE_RE, `$1${next}$2`));

  run('git', ['add', '.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', 'plugin.json', 'README.md']);
  run('git', ['commit', '-m', `chore(release): bump ${PLUGIN_NAME} to ${next}`]);
  console.log(`Commit: chore(release): bump ${PLUGIN_NAME} to ${next}`);
  if (!publish) return;

  run('git', ['push', 'origin', SOURCE_BRANCH]);
  const commits = run('git', ['log', `origin/${TARGET_BRANCH}..HEAD`, '--pretty=- %s']);
  const count = commits.split('\n').filter(Boolean).length;
  const body = [
    `## Promoción ${SOURCE_BRANCH} → ${TARGET_BRANCH}`,
    '',
    `Libera \`${PLUGIN_NAME}\` ${next}.`,
    '',
    `### Commits (${count})`,
    commits,
    '',
    '🤖 Generated with [Claude Code](https://claude.com/claude-code)',
  ].join('\n');
  const pr = run('gh', ['pr', 'create', '--base', TARGET_BRANCH, '--head', SOURCE_BRANCH, '--title', `Promoción ${SOURCE_BRANCH} → ${TARGET_BRANCH} (${count} commits)`, '--body', body]);
  console.log(`PR: ${pr}`);
  run('gh', ['pr', 'merge', pr, '--merge']);
  const release = run('gh', ['release', 'create', tag, '--target', TARGET_BRANCH, '--title', tag, '--generate-notes']);
  console.log(`Release: ${release}`);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { bump, replaceVersion };
