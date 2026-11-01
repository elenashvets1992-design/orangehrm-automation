import { test } from '../../src/fixtures/test.fixtures';
import { env } from '../../src/config/env';
import { buildEmployee, buildEmployeeUpdate } from '../../src/data/employee.factory';

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

  test('Cancelling the deletion keeps the employee', async ({
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