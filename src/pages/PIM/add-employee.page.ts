import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { routes } from '../../config/routes';
import { Employee } from '../../data/employee.types';

export class AddEmployeePage extends BasePage {
    private readonly firstNameInput: Locator;
    private readonly middleNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly employeeIdInput: Locator;
    private readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);

        this.firstNameInput = page.getByPlaceholder('First Name');
        this.middleNameInput = page.getByPlaceholder('Middle Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        // no name/id/placeholder
        this.employeeIdInput = page.locator('.oxd-input-group', { hasText: 'Employee Id' }).locator('input');
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

// Open page by url
    async open() {
        await this.goto(routes.addEmployee);
    }

// Create employee
    async createEmployee(employee: Employee) {
        await this.firstNameInput.fill(employee.firstName);
        await this.middleNameInput.fill(employee.middleName);
        await this.lastNameInput.fill(employee.lastName);
        await this.employeeIdInput.fill(employee.employeeId);
        await this.saveButton.click();
    }

// Check opening details page w=for new employee 
    async expectEmployeeCreated() {
        await expect(this.page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+/);
    }

// Check empty requared field
    async save() {
        await this.saveButton.click();
    }

// Check error message with empty requared field
    async expectRequiredFieldErrors() {
        await expect(this.page.getByText('Required', { exact: true })).toHaveCount(2);
        await expect(this.page).toHaveURL(/addEmployee/);
    }  
}