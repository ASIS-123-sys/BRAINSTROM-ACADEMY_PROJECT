// Reusable SMS helper using Fast2SMS (https://www.fast2sms.com).
// Requires FAST2SMS_API_KEY in your environment variables.
//
// IMPORTANT (India only): sending transactional/promotional SMS legally
// requires DLT registration with your telecom operator via TRAI's platform,
// regardless of which SMS provider you use. Your Sender ID and each exact
// message template must be pre-approved on DLT, or messages will be
// silently blocked once you go live. See the notes at the bottom of this
// file for what that involves.

type SmsResult = { success: boolean; error?: string };

// Sends one SMS to one 10-digit Indian mobile number.
export async function sendSms(
  phone: string,
  message: string,
): Promise<SmsResult> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.error("FAST2SMS_API_KEY is not set — skipping SMS send.");
    return { success: false, error: "SMS not configured" };
  }

  // Strip anything except digits, then take the last 10 (handles numbers
  // stored with +91, spaces, or dashes)
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (cleanPhone.length !== 10) {
    return { success: false, error: `Invalid phone number: ${phone}` };
  }

  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q", // "q" = quick/transactional route; swap per your Fast2SMS plan
        message,
        numbers: cleanPhone,
      }),
    });

    const json = await res.json();
    if (!json.return) {
      return { success: false, error: json.message?.[0] || "SMS failed" };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: "Network error sending SMS" };
  }
}

// Sends the same message to many numbers at once (used for notices).
// Fast2SMS supports comma-separated numbers in one call, which is far
// cheaper/faster than looping sendSms() one-by-one.
export async function sendBulkSms(
  phones: string[],
  message: string,
): Promise<SmsResult> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.error("FAST2SMS_API_KEY is not set — skipping bulk SMS send.");
    return { success: false, error: "SMS not configured" };
  }

  const cleanNumbers = phones
    .map((p) => p.replace(/\D/g, "").slice(-10))
    .filter((p) => p.length === 10);

  if (cleanNumbers.length === 0) {
    return { success: false, error: "No valid phone numbers" };
  }

  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message,
        numbers: cleanNumbers.join(","),
      }),
    });

    const json = await res.json();
    if (!json.return) {
      return { success: false, error: json.message?.[0] || "SMS failed" };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: "Network error sending SMS" };
  }
}
