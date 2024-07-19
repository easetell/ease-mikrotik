import { Agents } from '@/types/agents';
import { Order } from '@/types/orders';

export const fetchAndUpdateSalesData = async () => {
    try {
        const agentsResponse = await fetch('/api/agents');
        const agentsData = await agentsResponse.json();
        const agents: Agents[] = agentsData.agents;

        const ordersResponse = await fetch('/api/orders');
        const ordersData = await ordersResponse.json();
        const orders: Order[] = ordersData.orders;

        const salesData = await Promise.all(agents.map(async (agent) => {
            const fromDate = new Date(agent.from);
            const toDate = new Date(agent.to);

            const agentSales = orders
                .filter(order =>
                    order.agentId === agent.agentId &&
                    new Date(order.time) >= fromDate &&
                    new Date(order.time) <= toDate
                )
                .reduce((total, order) => total + order.paidAmount, 0);

            const updatedAgent = { ...agent, achieved: agentSales };

            // Update agent in the database
            try {
                const response = await fetch(`/api/agents/${agent.agentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ achieved: agentSales }),
                });

                if (!response.ok) {
                    console.error('Failed to update agent achieved field:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating agent achieved field:', error);
            }

            return updatedAgent;
        }));

        return salesData;
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return [];
    }
};
