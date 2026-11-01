import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { Employee } from '../../data/employee.types';

export class EmployeeDetailsPage extends BasePage {
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;

    constructor(page: Page) {
        super(page);

        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
    }

    // Check that page shows the employee's dtaa that was created
    async expectLoaded(employee: Employee) {
        await expect(this.page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+/);
        await expect(this.firstNameInput).toHaveValue(employee.firstName);
        await expect(this.lastNameInput).toHaveValue(employee.lastName);
    }
}