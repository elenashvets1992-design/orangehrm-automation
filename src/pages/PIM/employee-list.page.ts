import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class EmployeeListPage extends BasePage {
    private readonly addButton: Locator;

    constructor(page: Page) {
        super(page);

       this.addButton = page.locator('.orangehrm-header-container').getByRole('button');
    }

    async clickAdd() {
        await this.addButton.click();
    }
}