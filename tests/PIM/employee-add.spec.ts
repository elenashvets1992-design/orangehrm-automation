import { test } from '../../src/fixtures/test.fixtures';
import { env } from '../../src/config/env';
import { buildEmployee } from '../../src/data/employee.factory';

test.describe('Add employee', () => {
  test.beforeEach(async ({ loginPage, dashboardPage, sidebar, employeeListPage }) => {
    await loginPage.open();
    await loginPage.login(env.adminUser, env.adminPassword);
    await dashboardPage.expectLoaded();
    await sidebar.openMenu('PIM');
    await employeeListPage.clickAdd();
  });

  test('Create a new employee', async ({ addEmployeePage }) => {
    const employee = buildEmployee();

    await addEmployeePage.createEmployee(employee);
    await addEmployeePage.expectEmployeeCreated();
  });

  test('Required fields are validated', async ({ addEmployeePage }) => {
    await addEmployeePage.save();
    await addEmployeePage.expectRequiredFieldErrors();
  });

});