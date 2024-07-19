import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/db';
import Agent from '@/models/Agent';

// GET route to add a new agent
export async function GET() {
    await connectDB();

    try {
        const agents = await Agent.find({});
        return NextResponse.json({ agents }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch agents' }, { status: 500 });
    }
}

// POST route to add a new agent
export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const { agentId, agentName, phone, email, region, target, achieved, status, from, to } = await req.json();

        // Check if agentName already exists
        const existingAgent = await Agent.findOne({ agentId });
        if (existingAgent) {
            return NextResponse.json({ message: 'Agent id already exists' }, { status: 400 });
        }

        const newAgent = new Agent({
            agentId,
            agentName,
            phone,
            email,
            region,
            target,
            achieved,
            status,
            from,
            to
        });

        await newAgent.save();

        return NextResponse.json({ message: 'Agent created successfully', agent: newAgent }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to create agent' }, { status: 500 });
    }
}
