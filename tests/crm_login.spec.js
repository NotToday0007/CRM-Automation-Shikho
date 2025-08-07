// tests/login.spec.js
import { test, expect } from '@playwright/test';

const loginUrl = 'https://crm.shikho.dev/signin';
const dashboardUrl = 'https://crm.shikho.dev/dashboard';

const validEmail = 'rifatkhan.khan01@gmail.com';
const validPassword = '123456';

//Helper: Login expecting success
async function loginExpectSuccess(page, email, password) {
  await page.goto(loginUrl);
  await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
  await page.getByRole('textbox', { name: 'Enter Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL(dashboardUrl, { timeout: 10000 });
  await expect(page).toHaveURL(dashboardUrl);

  const designation = page.locator('.cr-user-designation');
  await expect(designation).toBeVisible();
  console.log('Logged in as:', await designation.textContent());
}

//Helper: Login expecting error 
async function loginExpectFailure(page, email, password) {
  await page.goto(loginUrl);
  await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
  await page.getByRole('textbox', { name: 'Enter Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  const errorToast = page.locator('text=These credentials do not match our records.');
  await expect(errorToast).toBeVisible({ timeout: 3000 });
  console.log('Login failed toast appeared');
}

// For frontend validation errors
async function trySubmitLogin(page, email, password) {
  await page.goto(loginUrl);
  await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
  await page.getByRole('textbox', { name: 'Enter Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test.describe('CRM Login Scenario', () => {
  //Positive Scenario
  test('Valid login redirects to dashboard', async ({ page }) => {
    await loginExpectSuccess(page, validEmail, validPassword);
  });

  //Negative Login Failures
  test('Invalid email with valid password', async ({ page }) => {
    await loginExpectFailure(page, 'wrongemail@gmail.com', validPassword);
  });

  test('Valid email with wrong password', async ({ page }) => {
    await loginExpectFailure(page, validEmail, 'wrongpass123');
  });

  // Form Validation Errors
  test('Invalid email format', async ({ page }) => {
    await trySubmitLogin(page, 'rifatkhan.com', validPassword);
  });

  test('Empty email field', async ({ page }) => {
    await trySubmitLogin(page, '', validPassword);
    const emailError = page.locator('.ant-form-item-explain-error');
    await expect(emailError).toHaveText(/email/i);
  });

  test('Empty password field', async ({ page }) => {
    await trySubmitLogin(page, validEmail, '');
    const passwordError = page.locator('.ant-form-item-explain-error');
    await expect(passwordError).toHaveText(/password/i);
  });

  test('Both email & password fields empty', async ({ page }) => {
    await trySubmitLogin(page, '', '');
    const errors = page.locator('.ant-form-item-explain-error');

   await expect(errors).toHaveCount(2);
  const errorTexts = await errors.allTextContents();
  expect(errorTexts.some(text => /password/i.test(text))).toBeTruthy();
  expect(errorTexts.some(text => /email/i.test(text))).toBeTruthy();
  });
});
