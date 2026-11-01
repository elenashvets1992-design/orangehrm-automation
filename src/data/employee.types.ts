// what an employee looks like in tests
export interface Employee {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
}

// what we change on the details page (Employee Id stays the same, we search by it)
export interface EmployeeUpdate {
  firstName: string;
  middleName: string;
  lastName: string;
  otherId: string;
  driverLicense: string;
  licenseExpiryDate: string;
  dateOfBirth: string;
  nationality: string;
  maritalStatus: string;
  gender: 'Male' | 'Female';
}