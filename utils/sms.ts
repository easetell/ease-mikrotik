export async function sendSMS({ phone, message }: { phone: string; message: string }) {
  const smsApiUrl = process.env.NEXT_PUBLIC_SMS_API_URL;
  const userId = process.env.NEXT_PUBLIC_USER_ID;
  const password = process.env.NEXT_PUBLIC_PASSWORD;
  const senderName = process.env.NEXT_PUBLIC_SENDER_NAME;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!smsApiUrl || !userId || !password || !senderName || !apiKey) {
    throw new Error('Missing environment variables');
  }

  const smsResponse = await fetch(smsApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': apiKey,
    },
    body: JSON.stringify({
      userid: userId,
      password,
      senderid: senderName,
      msgType: 'text',
      duplicatecheck: 'true',
      sendMethod: 'quick',
      sms: [
        {
          mobile: [phone],
          msg: message,
        },
      ],
    }),
  });

  if (!smsResponse.ok) {
    const smsError = await smsResponse.text();
    throw new Error('Failed to send SMS: ' + smsError);
  }

  return smsResponse.json();
}

