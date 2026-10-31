import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '../config/routes';

export class LoginPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorAlert: Locator;
    //readonly path = '/web/index.php/auth/login';

    constructor(page: Page) {
        super(page);

        this.usernameInput = page.getByPlaceholder('username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorAlert = page.getByRole('alert');
    }

    //open the page
    async open() {
        await this.goto(routes.login);
    }

    // positive test for login
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    // negative test for login
    async expectInvalidCredentials() {
        await expect(this.errorAlert).toBeVisible();
        await expect(this.errorAlert).toContainText('Invalid credentials');
    }
}