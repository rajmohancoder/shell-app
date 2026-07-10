import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const pkgPath = resolve(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const sharedLibsExists = existsSync(resolve(root, '../shared-libs/packages'));

function runInstall() {
  try {
    execSync('pnpm install', { stdio: 'inherit', cwd: root });
  } catch {
    // pnpm exits 1 for non-fatal warnings like ERR_PNPM_IGNORED_BUILDS;
    // the install itself completed successfully.
  }
}

if (sharedLibsExists) {
  console.log('shared-libs workspace found — installing with workspace:^');
  runInstall();
} else {
  console.log('No shared-libs workspace — installing @rajmohancoder/* from GitHub Packages');
  const original = readFileSync(pkgPath, 'utf-8');
  const deps = pkg.dependencies || {};
  let modified = false;
  for (const [name, ver] of Object.entries(deps)) {
    if (name.startsWith('@rajmohancoder/') && ver.startsWith('workspace:')) {
      deps[name] = ver.replace('workspace:', '');
      modified = true;
    }
  }
  if (modified) {
    pkg.dependencies = deps;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }
  try {
    runInstall();
  } finally {
    writeFileSync(pkgPath, original);
  }
}
