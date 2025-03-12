#!/usr/bin/env node

/**
 * CLI wrapper that increases Node.js memory limit for handling large projects
 */

// Calculate memory to allocate based on available system memory
// Default to 4GB if we can't determine system memory
const defaultMemory = 4096;
let memorySizeInMB = defaultMemory;

try {
  // Try to get system memory if possible
  const os = require('os');
  const totalMemoryGB = os.totalmem() / (1024 * 1024 * 1024);
  
  // Use half of system memory up to a reasonable limit
  memorySizeInMB = Math.min(Math.floor(totalMemoryGB * 1024 / 2), 8192);
  
  // But never go below 2GB
  memorySizeInMB = Math.max(memorySizeInMB, 2048);
} catch (error) {
  console.warn('Unable to determine system memory, using default allocation.');
}

// Spawn process with increased memory
const { spawnSync } = require('child_process');
const path = require('path');

// Get all command line arguments
const args = process.argv.slice(2);

// Path to the actual CLI script
const cliPath = path.join(__dirname, '..', 'src', 'cli.js');

// Add a verbose flag if the user explicitly requests it
if (args.includes('-v') || args.includes('--verbose')) {
  console.log(`Running with increased memory allocation: ${memorySizeInMB}MB`);
}

// Execute the CLI with increased memory
const result = spawnSync(process.execPath, [
  `--max-old-space-size=${memorySizeInMB}`,
  cliPath,
  ...args
], {
  stdio: 'inherit',
  encoding: 'utf-8'
});

// Forward the exit code
process.exit(result.status);