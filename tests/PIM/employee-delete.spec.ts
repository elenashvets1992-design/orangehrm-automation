import { test } from '../../src/fixtures/test.fixtures';
import { env } from '../../src/config/env';
import { buildEmployee, buildEmployeeUpdate } from '../../src/data/employee.factory';
//import { TIMEOUT } from 'node:dns';

const random = Math.random().toString(36).substring(2, 7);

test.describe('PIM employee flow', () => {
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await loginPage.open();
    await loginPage.login(env.adminUser, env.adminPassword);
    await dashboardPage.expectLoaded();
  });

  test('Delete an employee', async ({
    sidebar,
    employeeListPage,
    addEmployeePage,
  }) => {
    const employee = buildEmployee();

    await test.step('Create an employee to delete', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.clickAdd();
      await addEmployeePage.createEmployee(employee);
      await addEmployeePage.expectEmployeeCreated();
    });

    await test.step('Delete the employee', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.searchByID(employee.employeeId);
      // make sure the row is ours and unique before clicking the trash icon
      await employeeListPage.expectEmployeeFound(employee.employeeId);
      await employeeListPage.deleteEmployee(employee.employeeId);
    });
      await test.step('Verify the employee no longer exists', async () => {
      await employeeListPage.searchByID(employee.employeeId);
      await employeeListPage.expectNoRecordsFound();
    });
  });

  test('Cancel employee deletion', async ({
    sidebar,
    employeeListPage,
    addEmployeePage,
  }) => {
    const employee = buildEmployee();

    await test.step('Create an employee', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.clickAdd();
      await addEmployeePage.createEmployee(employee);
      await addEmployeePage.expectEmployeeCreated();
    });

    await test.step('Start the deletion and cancel it', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.searchByID(employee.employeeId);
      await employeeListPage.cancelDeletion(employee.employeeId);
    });

    // the employee must still be in the list
    await test.step('Verify the employee still exists', async () => {
      await employeeListPage.expectEmployeeFound(employee.employeeId);
    });
  });

});