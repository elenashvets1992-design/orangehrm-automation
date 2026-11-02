import { test as setup } from '../src/fixtures/test.fixtures';
import { env } from '../src/config/env';
import { authFile } from '../src/config/auth';

// Saves the session once after login
setup('authenticate as admin', async ({ loginPage, dashboardPage, page }) => {
  await loginPage.open();
  await loginPage.login(env.adminUser, env.adminPassword);
  await dashboardPage.expectLoaded();
  await page.context().storageState({ path: authFile });
});