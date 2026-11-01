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

  test('Duplicate Employee Id is rejected', async ({
    sidebar,
    employeeListPage,
    addEmployeePage,
  }) => {
    const employee = buildEmployee();
    // another person with the same Employee Id
    const duplicate = { ...buildEmployee(), employeeId: employee.employeeId };

    await test.step('Create an employee', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.clickAdd();
      await addEmployeePage.createEmployee(employee);
      await addEmployeePage.expectEmployeeCreated();
    });

    await test.step('Try to create another employee with the same Id', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.clickAdd();
      await addEmployeePage.fillForm(duplicate);
      await addEmployeePage.expectEmployeeIdAlreadyExists();
      await addEmployeePage.save();
      await addEmployeePage.expectStillOnAddForm();
    });

    // the main check: no second record was created
    await test.step('Verify only one employee has this Id', async () => {
      await sidebar.openMenu('PIM');
      await employeeListPage.searchByID(employee.employeeId);
      await employeeListPage.expectEmployeeFound(employee.employeeId);
    });
  });

});