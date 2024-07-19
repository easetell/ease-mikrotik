"use client"
import React, { useState } from 'react';
import { AgentStickyBar } from './AgentStickyBar';
import EditAgent from './EditAgent';
import DeleteAgent from './DeleteAgent';
import AgentsHeader from './AgentsHeader';
import renderStatusBadge from './RenderStatus';
import { useSalesData } from './useSalesData';
import achievedStatus from './achievedStatus';

const AgentsTable: React.FC = () => {
  const { agents, isLoading } = useSalesData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [isEditFormVisible, setEditFormVisible] = useState(false);
  const [selectedIdNo, setSelectedIdNo] = useState<string>('');
  const [isDeleteFormVisible, setDeleteFormVisible] = useState(false);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page on search
  };

  const filteredAgents = agents.filter(agent =>
    agent.agentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * limit < filteredAgents.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEditButtonClick = (id: string) => {
    setSelectedIdNo(id);
    setEditFormVisible(true);
    // console.log("Edit button clicked, id:", id);  // Debugging log
  };

  const closeEditForm = () => {
    setEditFormVisible(false);
  };

  const handleDeleteButtonClick = (id: string) => {
    setSelectedIdNo(id);
    setDeleteFormVisible(true);
  };

  const closeDeleteForm = () => {
    setDeleteFormVisible(false);
  };

  return (
    <>
      <AgentsHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="overflow-auto shadow">
          <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
            <thead className='bg-gray-100 dark:bg-gray-700'>
              <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                <th className="sr-only min-w-[50px] py-4 px-4 font-medium text-dark dark:text-white">
                  Id
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-dark dark:text-white">
                  Full Names
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-dark dark:text-white">
                  Phone
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-dark dark:text-white">
                  Email
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-dark dark:text-white">
                  Region
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-dark dark:text-white">
                  Target
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-dark dark:text-white">
                  Achieved
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-dark dark:text-white">
                  status
                </th>
                <th className="min-w-[200px] py-4 px-4 font-medium text-dark dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedAgents.map((agentItem) => (
                <tr key={agentItem.agentId}>
                  <td className="sr-only border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {agentItem.agentId}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {agentItem.agentName}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {agentItem.phone}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {agentItem.email}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {agentItem.region}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      { }
                      Ksh. {Intl.NumberFormat().format(Number(agentItem.target))}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {achievedStatus(Number(agentItem.target), Number(agentItem.achieved))}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {renderStatusBadge(agentItem.status)}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3 p-4 space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleEditButtonClick(agentItem.agentId)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary dark:bg-primary dark:hover:bg-[#645de8e7] hover:bg-[#645de8e7] focus:ring-4 focus:ring-[#645de8e7] dark:focus:ring-[#645de8e7]"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path
                          fillRule="evenodd"
                          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteButtonClick(agentItem.agentId)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delete Agent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <EditAgent isVisible={isEditFormVisible} onClose={closeEditForm} selectedIdNo={selectedIdNo} />
          <DeleteAgent isVisible={isDeleteFormVisible} onClose={closeDeleteForm} selectedIdNo={selectedIdNo} />
        </div>
        <AgentStickyBar
          page={currentPage}
          total={filteredAgents.length}
          limit={limit}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </div>
    </>
  );
};

export default AgentsTable;
