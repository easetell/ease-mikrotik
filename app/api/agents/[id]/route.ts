//api/Agent/[id].js
import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/config/db';
import Agent from '@/models/Agent';

// Type for the request parameters
interface Params {
    id: string;
}

// Get a single agent by agentId
export async function GET(request: NextRequest, { params }: { params: Params }) {
    await connectDB();

    const { id } = params; // This should be agentId

    try {
        const agent = await Agent.findOne({ agentId: id }); // Find agent by agentId
        if (!agent) {
            return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
        }
        return NextResponse.json({ agent }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch agent:', error);
        return NextResponse.json({ message: 'Failed to fetch agent' }, { status: 500 });
    }
}

// Update a single agent by agentId
export async function PUT(request: NextRequest, { params }: { params: Params }) {
    await connectDB();

    const { id } = params; // This should be agentId

    try {
        const agentData = await request.json();

        const agent = await Agent.findOneAndUpdate(
            { agentId: id }, // Find agent by agentId
            agentData,
            {
                new: true, // Return the updated agent
                runValidators: true, // Validate before updating
            }
        );

        if (!agent) {
            return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
        }

        return NextResponse.json({ agent }, { status: 200 });
    } catch (error) {
        console.error('Failed to update agent:', error);
        return NextResponse.json({ message: 'Failed to update agent' }, { status: 500 });
    }
}

// DELETE a single agent by agentId
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    await connectDB();

    const { id } = params; // This should be agentId

    try {
        const agent = await Agent.findOneAndDelete({ agentId: id }); // Find and delete agent by agentId
        if (!agent) {
            return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Agent deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Failed to delete agent:', error);
        return NextResponse.json({ message: 'Failed to delete agent' }, { status: 500 });
    }
}