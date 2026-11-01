import { test } from '../../src/fixtures/test.fixtures';
import { env } from '../../src/config/env';
import { buildEmployee } from '../../src/data/employee.factory';

test.describe('PIM employee flow', () => {
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await loginPage.open();
    await loginPage.login(env.adminUser, env.adminPassword);
    await dashboardPage.expectLoaded();
  });

  test('Create and find an employee', async ({
    sidebar,
    employeeListPage,
    addEmployeePage,
    employeeDetailsPage,
  }) => {
    const employee = buildEmployee();

    await test.step('Create a new employee', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.clickAdd();
      await addEmployeePage.createEmployee(employee);
      await addEmployeePage.expectEmployeeCreated();
    });

    await test.step('Search for the created employee', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.searchByID(employee.employeeId);
      await employeeListPage.expectEmployeeFound(employee.employeeId);
    });

    await test.step('Open employee details', async () => {
      await employeeListPage.openEmployee(employee.employeeId);
      await employeeDetailsPage.expectLoaded(employee);
    });

  });

});