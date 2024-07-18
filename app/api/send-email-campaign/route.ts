import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/db';
import { EmailTemplate } from '@/models/Campaign'; // Adjust the import path
import Customer from '@/models/Customer'; // Adjust the import path
import { sendEmail } from '@/utils/email';
import { Customer as CustomerType } from '@/types/customers'; // Import the Customer type
import { Campaign } from '@/models/Campaign';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { name, description, startDate, endDate, audience, _id } = await req.json();

    const campaign = new Campaign({
      name,
      description,
      startDate,
      endDate,
      audience,
      campaignType: 'email',
      _id,
      status: 'scheduled',
    });

    await campaign.save();

    const template = await EmailTemplate.findById(_id).lean();

    if (!template) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    const results = [];

    for (const customerId of audience) {
      const customer: CustomerType | null = await Customer.findById(customerId).lean();

      if (customer && customer.email) {
        await sendEmail(customer.email,  '', '');
        results.push({ type: 'email', recipient: customer.email });
      }
    }

    return NextResponse.json({ message: 'Email campaign sent successfully', results }, { status: 200 });
  } catch (error) {
    console.error('Error creating email campaign:', error);
    return NextResponse.json({ message: 'Error creating email campaign' }, { status: 500 });
  }
}
