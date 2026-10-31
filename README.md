# OrangeHRM UI Automation

UI test automation for the [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/) built with Playwright and TypeScript.

Currently covered: **Login** (positive and negative scenario).
Planned: PIM flow (create, search, open, edit and verify an employee).

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

## Run

```bash
npx playwright test            # headless
npx playwright test --headed   # visible browser
npx playwright test --ui       # Playwright UI mode
npx playwright show-report     # open the HTML report
```

## Project structure

```
src/
  config/      env.ts (reads .env), routes.ts (page paths)
  pages/       page objects: base, login, dashboard
  fixtures/    custom test with page objects injected
tests/
  login/       login.spec.ts
playwright.config.ts
```

## Design decisions

- **POM.** Locators and page actions live in page objects, tests read like a scenario. If the UI changes, only one file needs an update.
- **Custom fixtures.** Page objects are injected into tests, so there is no `new LoginPage(page)` in every test, and each test gets a fresh instance.
- **Config outside the code.** Base URL and credentials come from `.env` (`.env.example` is committed as a template). Page paths are kept in one place, `routes.ts`.
- **Locators.** Role, placeholder and text first. The app uses generated `oxd-*` classes and `data-v-*` attributes, so CSS selectors are avoided.
- **Test selection.** Login is a supporting flow here, so only the happy path and one negative case are covered. More validation cases could be added as a parameterized test.
- **Execution.** Tests run in parallel by default. Dependent flows are meant to run in order using `test.step` or a serial group. In CI there is one worker (the demo site is shared) and retries.
- **Reporting.** HTML report plus a list in the terminal. Screenshot, video and trace are saved only for failures.
- **One browser.** Chromium is enough for this task, other browsers aren't required.