const { chromium } = require('playwright');

const numLeads = parseInt(process.argv[2] || '1');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // STEP 1: Login
  await page.goto('https://crm.shikho.dev/signin');
  await page.getByRole('textbox', { name: 'Email Address' }).fill('rifatkhan.khan0044444@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('123456');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('https://crm.shikho.dev/dashboard', { timeout: 10000 });

  console.log('✅ Logged in successfully');

  for (let i = 1; i <= numLeads; i++) {
    console.log(`➡ Creating lead ${i}...`);

    await page.goto('https://crm.shikho.dev/list/lead');
    await page.locator('button.ant-btn-icon-only:has(svg)').nth(5).click();

    const timestamp = Date.now().toString().slice(-5);
    await page.locator('input#mobile[placeholder="Enter mobile number with 88 prefix"]').fill(
      `880176${timestamp}${i.toString().padStart(2, '0')}`
    );
    await page.locator('#source').fill(`playwright ${i}`);
    await page.locator('#name').fill(`Test_Arif ${i}`);

    await page.locator('#product_id').click();
    await page.waitForSelector('.ant-select-item-option-content', { timeout: 4500 });
    await page.locator('.ant-select-item-option-content', { hasText: 'Shikho' }).click();

    await page.locator('#country_code').click();
    await page.getByText('Bangladesh').click();

    await page.locator('#cf_passing_year').click();
    await page.getByText('2023', { exact: true }).click();

    await page.locator('#cf_class').click();
    await page.getByText('Class 5', { exact: true }).click();

    await page.locator('#cf_group').click();
    await page.getByText('Science', { exact: true }).click();

    // Wait for response and grab prospect_id after Save
    const [response] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/v1/leads') && res.status() === 200),
      page.getByRole('button', { name: 'Save' }).click()
    ]);
    const resBody = await response.json();
    const prospectId = resBody?.prospect_id;

    if (!prospectId) {
      console.log(`❌ Failed to get prospect ID for lead ${i}`);
      continue;
    }

    console.log(`✅ Got prospect ID: ${prospectId}`);

    // Grab access token from localStorage
    const accessToken = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        const val = localStorage.getItem(key);
        if (val && val.includes("eyJ0eXAiOiJKV1QiLCJhbGciOi")) {
          try {
            const obj = JSON.parse(val);
            if (obj.access_token) return obj.access_token;
          } catch (err) {
            // raw token string, not JSON
            return val;
          }
        }
      }
      return null;
    });

    console.log("🔐 Found Access Token:", accessToken);

    // Send event with fetch inside page.evaluate
    const eventResult = await page.evaluate(async ({ prospectId, token }) => {
      const userId = "930"; // your real user ID here
      const paddedUserId = userId.padStart(5, '0'); // "00930"
      const logRefId = `crm-web-${paddedUserId}-${Date.now()}`;

      const eventData = {
        //"created_at": "2025-08-04 11:51:00",
        type: "shikho_purchase_completed",
        lead_prospect_id: prospectId,
        product_id: "1",
        cf_amount: 10000.0,
        cf_class_name: "Simple Harmonic Motion chapter 2",
        cf_course_name: "HSC '25 - মেডিকেল এডমিশন প্রোগ্রাম",
        cf_discounted_amount: 0,
        cf_duration: 270,
        cf_group_name: "SCIENCE",
        lead_stage_id: 5,
        lead_owner_id: 1975,
        cf_purchase_type: "full",
        cf_subscription_ended_at: "2025-10-08 00:15:00",
        cf_card_type: "VISA",
        cf_referral_code: "HSCACM1",
        cf_coupon_channel: "AAssk111",
        cf_program_type: "HSC"
      };

      try {
        const res = await fetch("https://crm-api.shikho.dev/api/v1/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-Log-Ref-Id": logRefId
          },
          body: JSON.stringify(eventData)
        });

        const text = await res.text();
        return {
          status: res.status,
          body: text
        };
      } catch (err) {
        return {
          status: 0,
          error: err.message
        };
      }
    }, { prospectId, token: accessToken });

    if (eventResult.status === 200) {
      console.log(`🎉 Event created successfully for lead ${i}`);
    } else {
      console.log(`❌ Event creation failed for lead ${i}`);
      console.log("🔁 Status:", eventResult.status);
      console.log("📦 Response:", eventResult.body || eventResult.error);
    }

    await page.waitForTimeout(1000);
  }

  await browser.close();
  console.log(`🚀 Done! Created ${numLeads} leads + events.`);
})();
