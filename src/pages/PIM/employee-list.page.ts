import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { Employee } from '../../data/employee.types';

export class EmployeeListPage extends BasePage {
    private readonly addButton: Locator;
    private readonly employeeIdFilter: Locator;
    private readonly searchButton: Locator;
    private readonly employeeNameFilter: Locator;
    private readonly resetButton: Locator;
    private readonly recordsCounter: Locator;

    constructor(page: Page) {
        super(page);

        //Add button
       this.addButton = page.locator('.orangehrm-header-container').getByRole('button');

       //Employee ID field in filters
       this.employeeIdFilter = page
            .locator('.oxd-table-filter')
            .locator('.oxd-input-group', { hasText: 'Employee Id' })
            .locator('input');
        
        //Search button
        this.searchButton = page.getByRole('button', { name: 'Search' });

        //Employee name field
        this.employeeNameFilter = page
            .locator('.oxd-table-filter')
            .locator('.oxd-input-group', { hasText: 'Employee Name' })
            .getByPlaceholder('Type for hints...');

        //Reset button   
        this.resetButton = page.getByRole('button', { name: 'Reset' });

        //Employee's counter  
        this.recordsCounter = page
            .locator('.orangehrm-horizontal-padding')
            .getByText(/\(\d+\)\s+Records? Found/);

    }
    
    //Add button click
    async clickAdd() {
        await this.addButton.click();
    }

    //Search by employee Id
    async searchByID(employeeId:string){
        await this.employeeIdFilter.fill(employeeId);
        await this.searchButton.click();
    }

    //Check that result is contain only 1 row
    async expectEmployeeFound(employeeId:string){//, lastName: string){
        const row= this.page.getByRole('row').filter({
            has: this.page.getByRole('cell', { name: employeeId, exact: true }),
        });
        await expect(row).toHaveCount(1);
        //await expect(row).toContainText(lastName);
    }  
    
    //Locator for the employee who was found
    private resultRow(employeeId: string): Locator {
        return this.page.getByRole('row').filter({
            has: this.page.getByRole('cell', { name: employeeId, exact: true }),
        });
    }

    // Click the cell by Id
    async openEmployee(employeeId: string) {
        await this.resultRow(employeeId).getByRole('cell', { name: employeeId, exact: true }).click();
    }

    // Search by employee name( typing in the field and than chosing from the list)
    async searchByName(employee: Employee) {
        await this.employeeNameFilter.pressSequentially(employee.lastName);
        await this.page.getByRole('option').filter({ hasText: employee.lastName }).click();
        await this.searchButton.click();
    }

    //Reset button check
    async reset() {
        await this.resetButton.click();
    }

    //Check employee Id filter after reset
    async expectEmployeeIdFilterEmpty() {
        await expect(this.employeeIdFilter).toHaveValue('');
    }

    //Check count of the employee in counter after updating
    async expectRecordsCounter(count: number) {
        await expect(this.recordsCounter).toContainText(`(${count})`);
    }

    //CHeck the counter is visible
    async expectRecordsCounterShown() {
        await expect(this.recordsCounter).toBeVisible();
    }
    
    //Open delete dialog check
    private async openDeleteDialog(employeeId: string) {
        await this.resultRow(employeeId).locator('button:has(.bi-trash)').click();
    }

    //Delete employee
    async deleteEmployee(employeeId: string) {
        await this.openDeleteDialog(employeeId);
        await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    }

    // Close 'Delete' pop-up
    async cancelDeletion(employeeId: string) {
        await this.openDeleteDialog(employeeId);
        await this.page.getByRole('button', { name: 'No, Cancel' }).click();
        await expect(this.page.getByText('Are you Sure?')).toBeHidden();
    }

    //Check that deleted employee doesn't exist in the list
    async expectNoRecordsFound() {
        await expect(
        this.page.locator('.orangehrm-horizontal-padding').getByText('No Records Found'),
        ).toBeVisible();
    }

}