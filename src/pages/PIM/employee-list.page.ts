import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class EmployeeListPage extends BasePage {
    private readonly addButton: Locator;
    private readonly employeeIdFilter: Locator;
    private readonly searchButton: Locator;

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

    // Click the call by Id
    async openEmployee(employeeId: string) {
        await this.resultRow(employeeId).getByRole('cell', { name: employeeId, exact: true }).click();
    }

}