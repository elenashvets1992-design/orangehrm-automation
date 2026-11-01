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

  test('Create, find and update an employee', async ({
    sidebar,
    employeeListPage,
    addEmployeePage,
    employeeDetailsPage,
  }) => {
    const employee = buildEmployee();
    const update = buildEmployeeUpdate();

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

    await test.step('Edit employee information', async () => {
      await employeeDetailsPage.edit(update);
    });

    await test.step('Verify the changes were saved', async () => {
      await employeeDetailsPage.expectSaved(update);
    });

  });

  test('Required fields are validated when editing an employee', async ({
    sidebar,
    employeeListPage,
    addEmployeePage,
    employeeDetailsPage,
  }) => {
    const employee = buildEmployee();

    await test.step('Create an employee', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.clickAdd();
      await addEmployeePage.createEmployee(employee);
      await addEmployeePage.expectEmployeeCreated();
    });

    await test.step('Clear the required fields', async () => {
      // wait until the fields are filled, otherwise the page may overwrite our changes
      await employeeDetailsPage.expectLoaded(employee);
      await employeeDetailsPage.clearRequiredFields();
    });

    await test.step('Try to save', async () => {
      await employeeDetailsPage.save();
    });

    // the main check: nothing was saved, the old names are still there after a reload
    await test.step('Verify the employee is unchanged', async () => {
      await employeeDetailsPage.reloadAndExpectLoaded(employee);
    });
  });

});