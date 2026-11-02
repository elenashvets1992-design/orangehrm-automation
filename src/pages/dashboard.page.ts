import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '../config/routes';

export class DashboardPage extends BasePage {
  private readonly heading: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'Dashboard' });
    }
    async open() {
        await this.goto(routes.dashboard);
    }
    async expectLoaded() {
        await expect(this.page).toHaveURL(routes.dashboard);    
        await expect(this.heading).toBeVisible();
    }
}