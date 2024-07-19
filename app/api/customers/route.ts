import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/db';
import Customer from '@/models/Customer';


// GET route to add a new customer
export async function GET() {
    await connectDB();

    try {
        const customers = await Customer.find({});
        return NextResponse.json({ customers }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch customers' }, { status: 500 });
    }
}

// POST route to add a new customer
export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const { customerName, agentId, email, phone, address, creditlimit } = await req.json();

        // Check if customerName already exists
        const existingCustomer = await Customer.findOne({ customerName });
        if (existingCustomer) {
            return NextResponse.json({ message: 'Customer name already exists' }, { status: 400 });
        }

        const newCustomer = new Customer({
            customerName,
            agentId,
            email,
            phone,
            address,
            creditlimit,
        });

        await newCustomer.save();

        return NextResponse.json({ message: 'Customer created successfully', customer: newCustomer }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to create customer' }, { status: 500 });
    }
}
