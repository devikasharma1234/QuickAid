const twilio = require('twilio');
const { v4: uuidv4 } = require('uuid');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendEmergencyLink(toPhoneNumber, db) {
  const requestId = uuidv4();

  const { error } = await db
    .from('emergency_requests')
    .insert({
      id: requestId,
      phone_number: toPhoneNumber,
      status: 'pending',
    });

  if (error) {
    throw new Error(`Failed to create emergency request: ${error.message}`);
  }

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