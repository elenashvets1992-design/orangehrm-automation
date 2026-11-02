import { test } from '../../src/fixtures/test.fixtures';
import { env } from '../../src/config/env';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('User can login with valid credentials', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(env.adminUser, env.adminPassword);
    await dashboardPage.expectLoaded();
  });

  test('Error is shown for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(env.adminUser, 'wrong-password');
    await loginPage.expectInvalidCredentials();
  });
});