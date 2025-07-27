import { test, expect } from '@playwright/test';

const loginUrl = 'https://crm.shikho.dev/signin';
const dashboardUrl = 'https://crm.shikho.dev/dashboard';
const email = 'rifatkhan.khan01@gmail.com';
const password = '123456'; 

// using placeholder
test('Login using placeholder', async ({ page }) => {
  await page.goto(loginUrl);

  await page.getByPlaceholder('Email Address').fill(email);
  await page.getByPlaceholder('Enter Password').fill(password);
  await page.waitForTimeout(300); 
  await page.getByText('Login').click();

  await expect(page).toHaveURL(dashboardUrl);
  await page.waitForTimeout(2000); 
  const designation = await page.locator('.cr-user-designation'); // CSS class selector
  await expect(designation).toBeVisible(); // Check it's there

  await page.goto(loginUrl);
});


// Using ID
test('Login using by ID', async ({ page }) => {
  await page.goto(loginUrl);

  await page.locator('#basic_email').first().fill(email);
  await page.locator('#basic_password').first().fill(password);
  await page.locator('button[type="submit"]').click();

await page.waitForURL(dashboardUrl, { timeout: 10000 }); 
await expect(page).toHaveURL(dashboardUrl);

  await page.waitForTimeout(2000);
   const designation = await page.locator('.cr-user-designation'); // CSS class selector
  await expect(designation).toBeVisible(); // Check it's there
  await page.goto(loginUrl);
});


// Using getByRole
test('Login using getByRole', async ({ page }) => {
  await page.goto(loginUrl);

 
  await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
  await page.getByRole('textbox', { name: 'Enter Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(dashboardUrl);
  await page.waitForTimeout(2000);
   const designation = await page.locator('.cr-user-designation'); // CSS class selector
  await expect(designation).toBeVisible(); // Check it's there
  
  await page.goto(loginUrl);
});


// Using getByText
test('Login using getByText ', async ({ page }) => {
  await page.goto(loginUrl);

  await page.locator('#basic_email').fill(email);
  await page.locator('#basic_password').fill(password);
  await page.getByText('Login').click();

  await expect(page).toHaveURL(dashboardUrl);
  await page.waitForTimeout(2000);
   const designation = await page.locator('.cr-user-designation'); // CSS class selector
  await expect(designation).toBeVisible(); // Check it's there
 

  await page.goto(loginUrl);
});

// using locator
test('Login using locator ', async ({ page }) => {
  await page.goto(loginUrl);

  await page.locator('#basic_email').first().fill(email);
  await page.locator('#basic_password').first().fill(password);
  await page.locator('button[type="submit"]').click();

  await page.waitForURL(dashboardUrl, { timeout: 10000 }); 
  await expect(page).toHaveURL(dashboardUrl);

  await page.waitForTimeout(2000);
   const designation = await page.locator('.cr-user-designation'); // CSS class selector
  await expect(designation).toBeVisible(); 

  await page.goto(loginUrl);
});
