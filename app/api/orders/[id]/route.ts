// pages/api/Crders/[id].js
import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/db';
import Order from '@/models/Order';
import mongoose from 'mongoose';
import Product from '@/models/Product';

// Type for the request parameters
interface Params {
    id: string;
}

//Get a single order
export async function GET(request: NextRequest, { params }: { params: Params }) {
    await connectDB();

    const { id } = params;

    try {
        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ order }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch order' }, { status: 500 });
    }
}

// Update a single order
export async function PUT(request: NextRequest, { params }: { params: Params }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    await connectDB();

    const { id } = params;

    try {
        const { customerName, products, amount, paidAmount, state, discount, vat } = await request.json();

        // Fetch the existing order
        const existingOrder = await Order.findById(id).session(session);
        if (!existingOrder) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // Reverse stock changes for previous products
        for (const item of existingOrder.products) {
            const product = await Product.findOne({ productName: item.productName }).session(session);
            if (product) {
                product.stock += item.quantity;
                await product.save({ session });
            }
        }

        // Check and update stock for new products
        for (const item of products) {
            const product = await Product.findOne({ productName: item.productName }).session(session);
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return NextResponse.json({ message: `Product ${item.productName} not found` }, { status: 404 });
            }

            if (product.stock < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return NextResponse.json({ message: `Not enough ${item.productName} in stock` }, { status: 400 });
            }

            product.stock -= item.quantity;
            await product.save({ session });
        }

        // Update the order
        existingOrder.customerName = customerName;
        existingOrder.products = products;
        existingOrder.amount = amount;
        existingOrder.paidAmount = paidAmount;
        existingOrder.state = state;
        existingOrder.discount = discount;
        existingOrder.vat = vat;

        await existingOrder.save({ session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ order: existingOrder }, { status: 200 });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Failed to update order:', error);
        return NextResponse.json({ message: 'Failed to update order' }, { status: 500 });
    }
}

// DELETE a single order
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    await connectDB();

    const { id } = params;

    try {
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete order' }, { status: 500 });
    }
}