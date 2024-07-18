import { NextResponse, NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'easetellnetworks.com',
    port: 465,
    auth: {
        user: 'info@easetellnetworks.com',
        pass: 'Camara&me@2003hd',
    },
    tls: {
        rejectUnauthorized: false // Set to true in production to validate certificates
    }
});

export async function POST(req: NextRequest) {
    try {
        const { productName, category, price, stock } = await req.json();

        if (stock < 100) {
            // Ensure environment variables are set
            const smsApiUrl = process.env.NEXT_PUBLIC_SMS_API_URL; // ZettaTel API endpoint
            const userId = process.env.NEXT_PUBLIC_USER_ID;
            const password = process.env.NEXT_PUBLIC_PASSWORD;
            const senderName = process.env.NEXT_PUBLIC_SENDER_NAME;
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;

            if (!smsApiUrl || !userId || !password || !senderName || !apiKey) {
                throw new Error('Missing environment variables');
            }

            // Log the request details
            console.log('Sending SMS with details:', {
                smsApiUrl,
                userId,
                password,
                senderName,
                apiKey,
                message: `The product "${productName}" is below the stock threshold with a level of ${stock}.`,
                phone: '+254114241145'
            });

            // Send SMS using ZettaTel
            const smsResponse = await fetch(smsApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey,
                },
                body: JSON.stringify({
                    userid: userId,
                    password: password,
                    senderid: senderName,
                    msgType: "text",
                    duplicatecheck: "true",
                    sendMethod: "quick",
                    sms: [
                        {
                            mobile: ['+254114241145'],
                            msg: `The product "${productName}" is below the stock threshold with a level of ${stock}.`
                        }
                    ]
                }),
            });

            if (!smsResponse.ok) {
                const smsError = await smsResponse.text();
                console.error('Failed to send SMS:', smsError);
                throw new Error('Failed to send SMS');
            }

            const smsData = await smsResponse.json();
            console.log('SMS sent successfully:', smsData);

            // Send Email using Nodemailer
            const mail = {
                from: 'info@easetellnetworks.com',
                to: 'easetellnetworks@gmail.com',
                subject: `Stock Alert for ${productName}`,
                text: `The product "${productName}" in category "${category}" with a price of Ksh. ${price} is below the stock threshold with a level of ${stock}.`
            };

            await transporter.sendMail(mail);

            return NextResponse.json({ message: 'Notification sent successfully', smsData }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Stock level is sufficient' }, { status: 200 });
        }
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Error sending notification' }, { status: 500 });
    }
}
