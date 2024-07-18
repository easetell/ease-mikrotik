// /api/products/[id].js
import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';

// Type for the request parameters
interface Params {
    id: string;
}

// Get a single product
export async function GET(request: NextRequest, { params }: { params: Params }) {
    await connectDB();

    const { id } = params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
    }
}

//Update a single product
export async function PUT(request: NextRequest, { params }: { params: Params }) {
    await connectDB();

    const { id } = params;

    try {
        const productData = await request.json();

        const product = await Product.findByIdAndUpdate(id, productData, {
            new: true, // Return the updated product
            runValidators: true, // Validate before updating
        });

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error('Failed to update product:', error);
        return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE a single product
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    await connectDB();

    const { id } = params;

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
    }
}