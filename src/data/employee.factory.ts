import { faker } from '@faker-js/faker';
import { Employee } from './employee.types';

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