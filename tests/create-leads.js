const { chromium } = require('playwright');
const numLeads = parseInt(process.argv[2] || '1'); // e.g. node create-leads.js 10

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Step 1: Login
  await page.goto('https://crm.shikho.dev/signin');
  await page.getByRole('textbox', { name: 'Email Address' }).fill('rifatkhan.khan0044444@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('123456');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('https://crm.shikho.dev/dashboard', { timeout: 10000 });

  console.log('✅ Logged in successfully');

  for (let i = 1; i <= numLeads; i++) {
    console.log(`➡ Creating lead ${i}...`);

    // Step 2: Go to lead page
    await page.goto('https://crm.shikho.dev/list/lead');
//    await page.waitForTimeout(1000);

    // Step 3: Click on the "Create Lead" button (using SVG 'plus' icon)
await page.locator('button.ant-btn-icon-only:has(svg)').nth(5).click(); // Index starts at 0







  //  await page.waitForTimeout(1000);

    // Step 4: Fill form fields
   const timestamp = Date.now().toString().slice(-5); // last 5 digits of milliseconds

await page.locator('input#mobile[placeholder="Enter mobile number with 88 prefix"]').fill(
  `880176${timestamp}${i.toString().padStart(2, '0')}`
);

    await page.locator('#source').fill(`playwright ${i}`);
    await page.locator('#name').fill(`Test_Arif ${i}`);

    // Step 5: Select "Shikho" for vertical (product_id = 1)
   await page.locator('#product_id').click();
   await page.waitForSelector('.ant-select-item-option-content', { timeout: 4500 });
   await page.locator('.ant-select-item-option-content', { hasText: 'Shikho' }).click();


    // Step 6: Select "Bangladesh" for country_code
    const countryDropdown = page.locator('#country_code');
    await countryDropdown.click();
    await page.getByText('Bangladesh').click(); // Select BD

   // await page.waitForTimeout(500); // wait a bit to stabilize
// await page.waitForTimeout(1000); // Adjust if needed

// ==== Select Passing Year ====
await page.locator('#cf_passing_year').click();  // Open the dropdown
await page.getByText('2023', { exact: true }).click();  // Click the desired year

// ==== Select Class ====
await page.locator('#cf_class').click();  // Open the class dropdown
await page.getByText('Class 5', { exact: true }).click();  // Click Class 5

// ==== Select Group ====
await page.locator('#cf_group').click();  // Open the group dropdown
await page.getByText('Science', { exact: true }).click();  // Click Science

    // Step 7: Submit the form
  await page.getByRole('button', { name: 'Save' }).click();


    // Optional wait between lead creation
    await page.waitForTimeout(1000);
  }

  await browser.close();
  console.log(`🎉 Successfully created ${numLeads} leads`);
})();
