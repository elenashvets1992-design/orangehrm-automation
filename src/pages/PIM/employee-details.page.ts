import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { Employee,EmployeeUpdate } from '../../data/employee.types';
 
export class EmployeeDetailsPage extends BasePage {
    private readonly firstNameInput: Locator;
    private readonly middleNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);

        this.firstNameInput = page.getByPlaceholder('First Name');
        this.middleNameInput = page.getByPlaceholder('Middle Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.saveButton = page.getByRole('button', { name: 'Save' }).first();
    }

    // Block of a field by its label
    private group(label: string): Locator {
        return this.page.locator('.oxd-input-group', { hasText: label });
    }

    // Custom dropdown (not a <select>)
    private async selectOption(label: string, option: string) {
        await this.group(label).locator('.oxd-select-text').click();
        await this.page.getByRole('option', { name: option, exact: true }).click();
    }

    // Method for fields with the date
    private async setDate(label: string, value: string) {
        const input = this.group(label).locator('input');
        await input.fill(value);
        await input.press('Tab');
        await expect(input).toHaveValue(value); 
    }

    // Check that page shows the employee's dtaa that was created
    async expectLoaded(employee: Employee) {
        await expect(this.page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+/);
        await expect(this.firstNameInput).toHaveValue(employee.firstName);
        await expect(this.lastNameInput).toHaveValue(employee.lastName);
    }

    //Editing all field in main div
    async edit(update: EmployeeUpdate & { licenseExpiryDate?: string; dateOfBirth?: string }) {
        await this.firstNameInput.fill(update.firstName);
        await this.middleNameInput.fill(update.middleName);
        await this.lastNameInput.fill(update.lastName);
        await this.group('Other Id').locator('input').fill(update.otherId);
        await this.group("Driver's License Number").locator('input').fill(update.driverLicense);
        await this.setDate('License Expiry Date', update.licenseExpiryDate);
        await this.setDate('Date of Birth', update.dateOfBirth);    
        await this.selectOption('Nationality', update.nationality);
        await this.selectOption('Marital Status', update.maritalStatus);
        // Click label becouse of radio input is hidden by default
        await this.group('Gender').getByText(update.gender, { exact: true }).click();
        await this.saveButton.click();
        await expect(this.page.getByText('Successfully Updated')).toBeVisible();
    }

    // reload the page and validating the data after updating
    async expectSaved(update: EmployeeUpdate) {
        await this.page.reload();
        await expect.soft(this.firstNameInput).toHaveValue(update.firstName);
        await expect.soft(this.middleNameInput).toHaveValue(update.middleName);
        await expect.soft(this.lastNameInput).toHaveValue(update.lastName);
        await expect.soft(this.group('Other Id').locator('input')).toHaveValue(update.otherId);
        await expect.soft(this.group("Driver's License Number").locator('input')).toHaveValue(update.driverLicense);
        await expect.soft(this.group('License Expiry Date').locator('input')).toHaveValue(update.licenseExpiryDate);
        await expect.soft(this.group('Date of Birth').locator('input')).toHaveValue(update.dateOfBirth);
        await expect.soft(this.group('Nationality').locator('.oxd-select-text-input')).toHaveText(update.nationality);
        await expect.soft(this.group('Marital Status').locator('.oxd-select-text-input')).toHaveText(update.maritalStatus);
        await expect.soft(this.group('Gender').getByRole('radio', { name: update.gender, exact: true })).toBeChecked();
    }

    //Check the error when the required fields are empty
    async clearRequiredFields() {
        await this.firstNameInput.clear();
        await expect(this.page.getByText('Required', { exact: true })).toHaveCount(1);
        await this.lastNameInput.clear();
        await expect(this.page.getByText('Required', { exact: true })).toHaveCount(2);
    }

    async save() {
        await this.saveButton.click();
    }

    async reloadAndExpectLoaded(employee: Employee) {
        await this.page.reload();
        await this.expectLoaded(employee);
    }       

}