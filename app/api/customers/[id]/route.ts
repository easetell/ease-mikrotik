// pages/api/Customers/[id].js
import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/db';
import Customer from '@/models/Customer';


// Type for the request parameters
interface Params {
    id: string;
}

//Get a single customer
export async function GET(request: NextRequest, { params }: { params: Params }) {
    await connectDB();

    const { id } = params;

    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json({ customer }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch customer' }, { status: 500 });
    }
}

//Update a single customer
export async function PUT(request: NextRequest, { params }: { params: Params }) {
    await connectDB();

    const { id } = params;

    try {
        const customerData = await request.json();

        const customer = await Customer.findByIdAndUpdate(id, customerData, {
            new: true, // Return the updated customer
            runValidators: true, // Validate before updating
        });

        if (!customer) {
            return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json({ customer }, { status: 200 });
    } catch (error) {
        console.error('Failed to update customer:', error);
        return NextResponse.json({ message: 'Failed to update customer' }, { status: 500 });
    }
}

// DELETE a single customer
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    await connectDB();

    const { id } = params;

    try {
        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) {
            return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Customer deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete customer' }, { status: 500 });
    }
}