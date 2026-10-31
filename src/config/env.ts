import 'dotenv/config';
//import process from 'node:process';

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
  adminUser: process.env.ADMIN_USER ?? 'Admin',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'admin123',
};