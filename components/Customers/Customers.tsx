"use client";
import React, { useState, useEffect } from 'react';
import { CustomerStickyBar } from './CustomerStickyBar';
import CustomerHeader from './CustomersHeader';
import EditCustomer from './EditCustomer';
import RemoveCustomer from './RemoveCustomer';
import { useSession } from '@clerk/clerk-react';
import debtStatus from './RenderStatus';
import { Customer } from '@/types/customers';

interface CustomersResponse {
  customers: Customer[];
  total: number;
}

const CustomerTable: React.FC = () => {
  const { session } = useSession(); // Clerk session
  const [isAdmin, setIsAdmin] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [isEditFormVisible, setEditFormVisible] = useState(false);
  const [selectedIdNo, setSelectedIdNo] = useState<string>('');
  const [isDeleteFormVisible, setDeleteFormVisible] = useState(false);

  useEffect(() => {
    if (session) {
      const userRole = session?.user?.publicMetadata?.role;
      setIsAdmin(userRole === 'admin');
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      const customerResponse = await fetch('/api/customers');
      const customerData: CustomersResponse = await customerResponse.json();
      const filteredCustomers = isAdmin
        ? customerData.customers
        : customerData.customers.filter(customer => customer.agentId === session?.user?.id);

      setCustomers(filteredCustomers);
      setTotal(filteredCustomers.length); // Update total to reflect the filtered list
    };

    fetchData();
  }, [isAdmin, session]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page on search
  };

  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * limit < filteredCustomers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEditButtonClick = (id: string) => {
    setSelectedIdNo(id);
    setEditFormVisible(true);
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
      <CustomerHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="overflow-auto shadow">
          <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
            <thead className='bg-gray-100 dark:bg-gray-700'>
              <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                <th className="min-w-[150px] py-4 px-4 font-medium text-dark dark:text-white">
                  Full Names
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-dark dark:text-white">
                  Email
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-dark dark:text-white">
                  Phone
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-dark dark:text-white">
                  Address
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-dark dark:text-white">
                  Credit Limit
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-dark dark:text-white">
                  Debt
                </th>
                <th className="min-w-[200px] py-4 px-4 font-medium text-dark dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customerItem) => (
                <tr key={customerItem._id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {customerItem.customerName}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {customerItem.email}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {customerItem.phone}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {customerItem.address}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      Ksh. {Intl.NumberFormat().format(customerItem.creditlimit)}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {debtStatus(customerItem.activedebt)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-dark-3 p-4 space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleEditButtonClick(customerItem._id)}
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
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteButtonClick(customerItem._id)}
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
                      Remove Customer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <EditCustomer isVisible={isEditFormVisible} onClose={closeEditForm} selectedIdNo={selectedIdNo} />
          <RemoveCustomer isVisible={isDeleteFormVisible} onClose={closeDeleteForm} selectedIdNo={selectedIdNo} />
        </div>
        <CustomerStickyBar
          page={currentPage}
          total={filteredCustomers.length}
          limit={limit}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </div>
    </>
  );
};

export default CustomerTable;
