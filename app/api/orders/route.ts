import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// GET route to add a new order
export async function GET() {
    await connectDB();

    try {
        const orders = await Order.find({});
        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
    }
}

//Post + Deducted state
export async function POST(req: NextRequest) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await connectDB();

        const { customerName, placedBy, agentId, time, products, amount, discount, vat, paidAmount, deliveryDate, state } = await req.json();

        // Check if order already exists based on customerName and time
        const existingOrder = await Order.findOne({ customerName, time }).session(session);
        if (existingOrder) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Order already exists' }, { status: 400 });
        }

        // Check and update stock for each product
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

        // Create the order
        const newOrder = new Order({
            customerName,
            placedBy,
            agentId,
            time,
            products,
            amount,
            discount,
            vat,
            paidAmount,
            deliveryDate,
            state,
        });

        await newOrder.save({ session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
