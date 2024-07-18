"use client"
import { useEffect, useState } from "react";
import { Agents } from "@/types/agents";

const SalesPerAgent = () => {
  const [agents, setAgents] = useState<Agents[]>([]);

  useEffect(() => {
    const fetchAgentsData = async () => {
      const agentsResponse = await fetch('/api/agents');
      const agentsData = await agentsResponse.json();
      const agents: Agents[] = agentsData.agents;

      // Calculate the percentage of target achieved
      const processedAgents = agents.map(agent => ({
        ...agent,
        conversion: ((Number(agent.achieved) / Number(agent.target)) * 100).toFixed(1)
      }));

      // Sort agents by achieved in descending order and take the top 5
      const topAgents = processedAgents.sort((a, b) => Number(b.achieved) - Number(a.achieved)).slice(0, 5);

      setAgents(topAgents);
    };

    fetchAgentsData();
  }, []);

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Top 5 Performing Agents
      </h4>
      <div className="flex flex-col">
        <div className="grid grid-cols-3 sm:grid-cols-5">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Agent Name
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Region
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Target Sales
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Achieved Sales
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Percentage
            </h5>
          </div>
        </div>

        {agents.map((agent, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${key === agents.length - 1
              ? ""
              : "border-b border-stroke dark:border-dark-3"
              }`}
            key={key}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <p className="font-medium text-dark dark:text-white sm:block">
                {agent.agentName}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {agent.region}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-green-light-1">
                Ksh. {Intl.NumberFormat().format(Number(agent.target))}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark dark:text-white">
                Ksh. {Intl.NumberFormat().format(Number(agent.achieved))}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark dark:text-white">
                {agent.conversion}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesPerAgent;
