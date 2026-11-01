import { Page } from '@playwright/test';

export class SidebarComponent {
    constructor(private readonly page: Page) {}

    // opens menu item by name
    async openMenu(name: string) {
        await this.page.getByRole('link', { name, exact: true }).click();
    }
}