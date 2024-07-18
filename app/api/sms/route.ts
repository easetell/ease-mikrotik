import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/db';
import { SmsTemplate } from '@/models/Campaign'; // Adjust the import path

// GET route to add a new SmsTemplate
export async function GET() {
  await connectDB();

  try {
      const smsTemplates = await SmsTemplate.find({});
      return NextResponse.json({ smsTemplates }, { status: 200 });
  } catch (error) {
      return NextResponse.json({ message: 'Failed to fetch smsTemplates' }, { status: 500 });
  }
}

// POST route to add a new SmsTemplate
export async function POST(req: NextRequest) {
  await connectDB();

  try {
      const { name, content } = await req.json();

      // Check if name already exists
      const existingSmsTemplate = await SmsTemplate.findOne({ name });
      if (existingSmsTemplate) {
          return NextResponse.json({ message: 'SmsTemplate already exists' }, { status: 400 });
      }

      const newSmsTemplate = new SmsTemplate({
          name,
          content,
      });

      await newSmsTemplate.save();

      return NextResponse.json({ message: 'SmsTemplate created successfully', SmsTemplate: newSmsTemplate }, { status: 201 });
  } catch (error) {
      return NextResponse.json({ message: 'Failed to create SmsTemplate' }, { status: 500 });
  }
}

