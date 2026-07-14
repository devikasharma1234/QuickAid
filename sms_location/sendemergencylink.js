const twilio = require('twilio');
const { v4: uuidv4 } = require('uuid');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Sends an SMS containing a one-time link that lets the user
 * share their live location + describe the emergency.
 *
 * @param {string} toPhoneNumber - E.164 format, e.g. "+919812345678"
 * @param {object} db - your Supabase/pg client
 */
async function sendEmergencyLink(toPhoneNumber, db) {
  const requestId = uuidv4();

  // Store a pending request row so we can match the response later
  await db.query(
    `INSERT INTO emergency_requests (id, phone_number, status, created_at)
     VALUES ($1, $2, 'pending', NOW())`,
    [requestId, toPhoneNumber]
  );

  const link = `${process.env.BASE_URL}/emergency/${requestId}`;

  const message = await client.messages.create({
    body: `Sanjeevani Emergency Alert: Tap this link to share your location and describe your emergency: ${link}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: toPhoneNumber,
  });

  console.log(`SMS sent (sid: ${message.sid}) for request ${requestId}`);
  return requestId;
}

module.exports = { sendEmergencyLink };