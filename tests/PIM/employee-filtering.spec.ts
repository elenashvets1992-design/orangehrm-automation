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

  test('Search by Employee Name finds the employee', async ({
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

    await test.step('Search by name using the autocomplete', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.searchByName(employee);
      await employeeListPage.expectEmployeeFound(employee.employeeId);
    });
  });

  test('Records counter matches the search result', async ({
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

    await test.step('Search by the unique Id and check the counter', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.searchByID(employee.employeeId);
      await employeeListPage.expectRecordsCounter(1);
    });
  });

  test('Reset clears the search filter', async ({ sidebar, employeeListPage }) => {
    await sidebar.openMenu('PIM');
    // a value that cannot match anyone, so the list is empty after the search
    await employeeListPage.searchByID(`OS_${random}`);
    await employeeListPage.expectNoRecordsFound();

    await employeeListPage.reset();
    await employeeListPage.expectEmployeeIdFilterEmpty();
    await employeeListPage.expectRecordsCounterShown();
  });

  test('Find and open employee detail page', async ({
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

  });

});