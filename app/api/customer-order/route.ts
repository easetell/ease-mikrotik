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

interface Product {
    productName: string;
    quantity: number;
}

interface CustomerDetails {
    email: string;
    phone: string;
    address: string;
}

interface RequestBody {
    customerName: string;
    customerDetails: CustomerDetails;
    products: Product[];
    amount: number;
    deliveryDate: string;
}

export async function POST(req: NextRequest) {
    try {
        const {
            customerName,
            customerDetails,
            products,
            amount,
            deliveryDate,
        }: RequestBody = await req.json();

        const { email, phone, address } = customerDetails;

        // Construct the products list
        const productDetails = products.map((product: Product) => `${product.productName} (Qty: ${product.quantity})`).join(', ');

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
            phone,
            senderName,
            apiKey,
            message: `Dear ${customerName}, your order for ${productDetails} has been placed successfully. Expected delivery date: ${new Date(deliveryDate).toLocaleDateString()}.\n\nThank you for shopping with Elgon Valley!`,
        });

        // Send SMS using ZettaTel
        const smsResponse = await fetch(smsApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
            },
            body: JSON.stringify({
                userid: userId,
                password: password,
                senderid: senderName,
                msgType: 'text',
                duplicatecheck: 'true',
                sendMethod: 'quick',
                sms: [
                    {
                        mobile: [phone],
                        msg: `Dear ${customerName}, your order for ${productDetails} has been placed successfully. Expected delivery date: ${new Date(deliveryDate).toLocaleDateString()}.\n\nThank you for shopping with Elgon Valley!`,
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
            to: email,
            subject: `Order Confirmation - ${customerName}`,
            text: `Dear ${customerName},\n\nYour order containing the following products: ${productDetails} has been placed successfully.\n\nExpected delivery date: ${deliveryDate}.\n\nShipping Address: ${address}\n\nTotal Amount: Ksh. ${amount}\n\nThank you for shopping with us!`
        };

        await transporter.sendMail(mail);

        return NextResponse.json({ message: 'Notification sent successfully', smsData }, { status: 200 });
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Error sending notification' }, { status: 500 });
    }
}