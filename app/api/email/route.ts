import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/db';
import { EmailTemplate } from '@/models/Campaign'; // Adjust the import path

// GET route to add a new emailtemplate
export async function GET() {
  await connectDB();

  try {
      const emailtemplates = await EmailTemplate.find({});
      return NextResponse.json({ emailtemplates }, { status: 200 });
  } catch (error) {
      return NextResponse.json({ message: 'Failed to fetch emailtemplates' }, { status: 500 });
  }
}

// POST route to add a new EmailTemplate
export async function POST(req: NextRequest) {
  await connectDB();

  try {
      const { name, content } = await req.json();

      // Check if name already exists
      const existingEmailTemplate = await EmailTemplate.findOne({ name });
      if (existingEmailTemplate) {
          return NextResponse.json({ message: 'EmailTemplate already exists' }, { status: 400 });
      }

      const newEmailTemplate = new EmailTemplate({
          name,
          content,
      });

      await newEmailTemplate.save();

      return NextResponse.json({ message: 'EmailTemplate created successfully', EmailTemplate: newEmailTemplate }, { status: 201 });
  } catch (error) {
      return NextResponse.json({ message: 'Failed to create EmailTemplate' }, { status: 500 });
  }
}
