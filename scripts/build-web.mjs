import { spawnSync } from 'node:child_process';
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run this script through npm run build');
const env = { ...process.env, EXPO_NO_TELEMETRY: '1' };
for (const args of [['--prefix', 'mobile', 'ci'], ['--prefix', 'mobile', 'run', 'export:web']]) {
  const result = spawnSync(process.execPath, [npmCli, ...args], { env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
