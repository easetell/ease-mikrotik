import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/db';
import { SmsTemplate } from '@/models/Campaign'; // Adjust the import path
import Customer from '@/models/Customer'; // Adjust the import path
import { sendSMS } from '@/utils/sms';
import { Customer as CustomerType } from '@/types/customers'; // Import the Customer type
import { Campaign } from '@/models/Campaign';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { name, description, startDate, endDate, audience, templateId } = await req.json();

    const campaign = new Campaign({
      name,
      description,
      startDate,
      endDate,
      audience,
      campaignType: 'sms',
      templateId,
      status: 'scheduled',
    });

    await campaign.save();

    const template = await SmsTemplate.findById(templateId).lean();

    if (!template) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    const results = [];

    for (const customerId of audience) {
        const customer: CustomerType | null = await Customer.findById(customerId).lean();

      if (customer && customer.phone) {
        results.push({ type: 'text', recipient: customer.phone });
      }
    }

    return NextResponse.json({ message: 'SMS campaign sent successfully', results }, { status: 200 });
  } catch (error) {
    console.error('Error creating SMS campaign:', error);
    return NextResponse.json({ message: 'Error creating SMS campaign' }, { status: 500 });
  }
}
