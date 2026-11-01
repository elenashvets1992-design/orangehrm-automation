import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { AddEmployeePage } from '../pages/PIM/add-employee.page';
import { EmployeeListPage } from '../pages/PIM/employee-list.page';
import { SidebarComponent } from '../components/sidebar.component';
import { EmployeeDetailsPage } from '../pages/PIM/employee-details.page';


// pages that can be asked by name in tests
type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  addEmployeePage: AddEmployeePage;
  employeeListPage: EmployeeListPage;
  sidebar: SidebarComponent;
  employeeDetailsPage: EmployeeDetailsPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  addEmployeePage: async ({ page }, use) => {
    await use(new AddEmployeePage(page));
  },
  employeeListPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new SidebarComponent(page));
  },
  employeeDetailsPage: async ({ page }, use) => {
    await use(new EmployeeDetailsPage(page));
},
});

// reexport
export { expect } from '@playwright/test';