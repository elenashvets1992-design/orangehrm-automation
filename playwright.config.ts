import { defineConfig, devices } from '@playwright/test';
//import process from 'node:process';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,  // parallel by default, dependent flows use serial/steps
  forbidOnly: !!process.env.CI, // no test.only in CI
  retries: process.env.CI ? 2 : 0, // retries only in CI
  workers: process.env.CI ? 1 : undefined, // demo site is shared
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: env.baseUrl, // from .env
    trace: 'on-first-retry',
    screenshot: 'only-on-failure', // debug artifacts only on failure
    video: 'retain-on-failure', // debug artifacts will saved only on failure
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }, 
  ],
});