#!/usr/bin/env node

import { TennisApp } from './src/TennisApp';

const app = new TennisApp();

// Get command line arguments (excluding 'node' and script name)
const args = process.argv.slice(2);

try {
  app.run(args);
} catch (error) {
  console.error(
    'Error:',
    error instanceof Error ? error.message : 'Unknown error'
  );
  process.exit(1);
}
