// hooks/useSalesData.ts
import { useEffect, useState } from 'react';
import { fetchAndUpdateSalesData } from './salesService';
import { Agents } from '@/types/agents';

export const useSalesData = () => {
    const [agents, setAgents] = useState<Agents[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getSalesData = async () => {
            setIsLoading(true);
            const data = await fetchAndUpdateSalesData();
            setAgents(data);
            setIsLoading(false);
        };

        getSalesData();
    }, []);

    return { agents, isLoading };
};
