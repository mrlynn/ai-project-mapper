#!/usr/bin/env node

/**
 * Memory-optimized CLI wrapper for Project Mapper
 * 
 * This script launches the actual CLI with increased memory allocation
 * to handle large projects without running out of memory.
 */

import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set memory allocation to 8GB (or customize as needed)
const memorySizeInMB = 8192;

// Output memory setting if verbose
const args = process.argv.slice(2);
if (args.includes('-v') || args.includes('--verbose')) {
  console.log(`Running with increased memory allocation: ${memorySizeInMB}MB`);
}

// Path to the actual CLI script
const cliPath = path.join(__dirname, '..', 'src', 'cli.js');

// Execute the CLI with increased memory
const result = spawnSync(process.execPath, [
  `--max-old-space-size=${memorySizeInMB}`,
  cliPath,
  ...args
], {
  stdio: 'inherit'
});

// Forward the exit code
process.exit(result.status || 0);