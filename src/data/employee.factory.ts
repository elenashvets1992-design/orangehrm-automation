import { faker } from '@faker-js/faker';
import { Employee, EmployeeUpdate } from './employee.types';


// builds a new employee with uniq data on every call
export function buildEmployee(): Employee {
  const suffix = Date.now().toString().slice(-6);
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: `OS_${faker.person.lastName()}`,
    //lastName: `OS_${suffix}`,
    employeeId: faker.string.numeric(6),
  };
}

// the date format of the field is kept in one place, so it is easy to change
function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${dd}-${mm}`;
}

// update employee
export function buildEmployeeUpdate(): EmployeeUpdate {
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    otherId: faker.string.numeric(5),
    driverLicense: faker.string.alphanumeric(8).toUpperCase(),
    licenseExpiryDate: formatDate(faker.date.future()),
    dateOfBirth: formatDate(faker.date.birthdate({ min: 20, max: 60, mode: 'age' })),
    nationality: faker.helpers.arrayElement(['British', 'Austrian', 'Ukrainian']),
    maritalStatus: faker.helpers.arrayElement(['Single', 'Married', 'Other']),
    gender: faker.helpers.arrayElement(['Male', 'Female'] as const),
  };
}