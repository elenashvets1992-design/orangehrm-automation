import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { routes } from '../../config/routes';
import { Employee } from '../../data/employee.types';
import path from 'path';

const DEFAULT_AVATAR_PATH = path.resolve(process.cwd(), 'src/data/avatar.jpeg');

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

        // Method for file uploading
        async uploadProfilePicture(filePath: string = DEFAULT_AVATAR_PATH) {
            const fileInput = this.page.locator('.orangehrm-employee-image input[type="file"]');
            await fileInput.setInputFiles(filePath);
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
        await this.uploadProfilePicture();
        await this.saveButton.click();
    }

// Check opening details page w=for new employee 
    async expectEmployeeCreated() {
        await expect(this.page).toHaveURL(/viewPersonalDetails\/empNumber\/\d+/, { timeout: 10000 });;
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