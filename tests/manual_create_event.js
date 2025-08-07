const { chromium } = require('playwright');

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

  // STEP 2: Grab access token
  const accessToken = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      const val = localStorage.getItem(key);
      if (val && val.includes("eyJ0eXAiOiJKV1QiLCJhbGciOi")) {
        try {
          const obj = JSON.parse(val);
          if (obj.access_token) return obj.access_token;
        } catch (err) {
          return val;
        }
      }
    }
    return null;
  });

  if (!accessToken) {
    console.log("❌ Failed to grab access token.");
    await browser.close();
    return;
  }

  console.log("🔐 Access Token found");

  // STEP 3: Set your known prospect ID
  let prospectId = '95376798-b9dd-4c96-b055-b92320eebdc1'; // Change this anytime

  if (!prospectId) {
    console.log("❌ No Prospect ID provided.");
    await browser.close();
    return;
  }

  console.log(`🆔 Using Prospect ID: ${prospectId}`);

  // STEP 4: Your dynamic list of events
  const allEventData = [
    {
      "created_at": "2025-08-04 11:38:00",
      type: "shikho_purchase_completed",
      lead_prospect_id: prospectId,
      product_id: "1",
      cf_amount: 10000.0,
      cf_program_id: "Math101",
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
    },
    {
     //    Academic Program Enrollment

   "created_at": "2025-08-04 11:57:00",
    type: "academic_program_enrollment",
    lead_prospect_id: prospectId,
    product_id: "1",
    cf_exam_year: "2027",
    cf_type_of_course: "Long",
    cf_class: "C9",
    lead_stage_id: 5,
    lead_owner_id: 975,
    cf_program_name: "SSC '25 - Medical Admission Program",
    cf_enrollment_type: "Paid",
    cf_enroll_batch_name: "Default",
   cf_event_time: "2025-10-29 12:00:00",
   cf_event_loc:"Dhaka"
    },
    // ✨ Add more if you want
    // Animated Video Played
{
  type: "animated_video_played",
  created_at: "2025-08-04 00:29:59",
  lead_prospect_id: prospectId,
  product_id: "1",
  cf_batch_year: "2024",
  cf_student_type: "FullApTrial",
  cf_duration_in_min: "200.84",
  cf_subject_name: "ইংরেজি ২য় পত্র"
},

// Homepage Video Summary
{
  type: "homepage_video_summary",
  created_at: "2025-08-04 00:27:59",
  lead_prospect_id: prospectId,
  product_id: "1",
  cf_event_count: "2",
  cf_duration_in_min: "200.84"
},

// Recorded Class Clicked V3
{
  type: "recorded_class_clicked_agg_dur",
  created_at: "2025-08-04 00:28:59",
  lead_prospect_id: prospectId,
  product_id: "1",
  cf_activity_duration: "10",
  cf_event_count: "2",
  cf_duration_in_min: "200.84"
},

// Animated Video Played V2
{
  type: "animated_video_agg_dur",
  created_at: "2025-08-04 00:29:59",
  lead_prospect_id:prospectId,
  product_id: "1",
  cf_activity_duration: "10",
  cf_event_count: "2",
  cf_duration_in_min: "200.84"
},

// Most Important Class Played
{
  type: "mi_video_played",
  created_at: "2025-08-04 00:22:59",
  lead_prospect_id: prospectId,
  product_id: "1",
  cf_user_category: "good",
  cf_student_type: "good",
  cf_class: "C8",
  cf_batch_year: "2007",
  cf_group: "Science",
  cf_video_title: "Most imp video",
  cf_subject_name: "English 2nd Paper"
},

// Click On Purchase
{
  type: "click_on_purchase",
  created_at: "2025-08-04 11:29:59",
  lead_prospect_id: prospectId,
  product_id: "1",
  cf_email: "rifat.rifat01@gmail.com",
  cf_exam_year: "2026",
  cf_phone: "880170543334",
  cf_course_name: "Math !st paper",
  cf_name: "Rahim",
  cf_class: "c7",
  cf_group: "Science",
  cf_course_id: "Cse 101",
  cf_school: "Ideal School"
},

// Admit Button Clicked
{
  type: "admit_button_clicked",
  created_at: "2025-08-05 10:29:59",
  lead_prospect_id: prospectId,
  product_id: "1",
  cf_user_category: "High",
  cf_batch_year: "2026",
  cf_class: "c7",
  cf_group: "Science",
  cf_course_id: "Cse 101"
},

// Ebook Downloaded
{
  type: "ebook_downloaded",
  created_at: "2025-08-05 11:25:59",
  lead_prospect_id: prospectId,
  product_id: "1",
  cf_app_screen_name: "Netflix",
  cf_pdf_file_name: "Math pdf",
  cf_pdf_title: "Math Slides",
  cf_passing_year: "2026",
  cf_class: "c7",
  cf_group: "Science",
  cf_course_id: "Cse 101",
  cf_user_category: "High"
},

// Discovery Tour Success
{
  type: "discovery_tour_success",
  created_at: "2025-08-05 00:45:59",
  lead_prospect_id: prospectId,
  product_id: "1",
  cf_name: "Rahit",
  cf_phone: "880170543334",
  cf_passing_year: "2026",
  cf_class: "c7",
  cf_group: "Science"
},

// Live Exam Result
{
  type: "live_exam_result",
  created_at: "2025-08-05 11:17:59",
  lead_prospect_id:prospectId,
  product_id: "1",
  cf_exam_count: "4",
  cf_achieved_percentage: "80.75",
  cf_subject_name: "Math"
},

// Event Count on Recorded Class Clicked V2
{
  type: "recorded_class_clicked_agg",
  lead_prospect_id: prospectId,
  product_id: "1",
  cf_event_date: "2025-08-05 18:40:00",
  cf_subject_list: "রসায়ন ১ম পত্র",
  cf_event_count: 2
},

// Recorded Class Clicked
{
  type: "recorded_class_viewed",
  created_at: "2025-08-04 00:58:59",
  lead_prospect_id: prospectId,
  product_id: "1",
  cf_student_type: "good",
  cf_batch_year: "2007",
  cf_subject_name: "Math"
}

  ];

  // STEP 5: Loop and send all events
  for (let i = 0; i < allEventData.length; i++) {
    const currentEventData = allEventData[i];

    const eventResult = await page.evaluate(async ({ eventData, token }) => {
      const userId = "930";
      const paddedUserId = userId.padStart(5, '0');
      const logRefId = `crm-web-${paddedUserId}-${Date.now()}`;

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
    }, { eventData: currentEventData, token: accessToken });

    // Result logging
    console.log(`📤 Sending Event #${i + 1}`);
    if (eventResult.status === 200) {
      console.log(`✅ Event #${i + 1} sent successfully`);
    } else {
      console.log(`❌ Failed to send Event #${i + 1}`);
      console.log("🔁 Status:", eventResult.status);
      console.log("📦 Response:", eventResult.body || eventResult.error);
    }

    await page.waitForTimeout(1000); // optional delay between sends
  }

  await browser.close();
  console.log("🚀 All done bhai!");
})();
