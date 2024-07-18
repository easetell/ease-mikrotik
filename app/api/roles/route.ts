import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Role from '@/models/Role';

export async function GET() {
    await connectDB();

    try {
        const roles = await Role.find({});
        return NextResponse.json({ roles }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch roles' }, { status: 500 });
    }
}