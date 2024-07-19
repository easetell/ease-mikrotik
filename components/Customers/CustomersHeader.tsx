"use client"
import React, { useState, useEffect } from 'react';
import AddCustomer from './AddCustomer';
import { Customer } from '@/types/customers';

interface CustomersHeaderProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
};

const CustomerHeader: React.FC<CustomersHeaderProps> = ({ searchTerm, onSearchChange }) => {
    const [isAddCustomerFormVisible, setAddCustomerFormVisible] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [total, setTotal] = useState(0);

    const handleAddCustomerButtonClick = () => {
        setAddCustomerFormVisible(true);
    };

    const closeAddCustomerForm = () => {
        setAddCustomerFormVisible(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    useEffect(() => {
        // Fetch customers and set the state
        const fetchData = async () => {
            // Replace with your fetch logic
            const response = await fetch('/api/customers');
            const data = await response.json();
            setCustomers(data.customers);
            setTotal(data.total);
        };

        fetchData();
    }, []);

    // Function to export data as CSV
    const exportAsCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Id,Full Names,Email,Phone,Address,Credit Limit,Active Debt,\n" +
            customers.map(customerItem =>
                `${customerItem._id},${customerItem.customerName},${customerItem.email},${customerItem.phone},${customerItem.address},${customerItem.creditlimit},${customerItem.activedebt}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "customers.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <>
            <div className="items-center justify-between block sm:flex">
                <div className="flex items-center mb-4 sm:mb-0">
                    <form className="sm:pr-3" action="#" method="GET">
                        <label htmlFor="customers-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-48 mt-1 sm:w-64 xl:w-96">
                            <input
                                type="text"
                                id="customers-search"
                                value={searchTerm}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-[#444444] text-dark sm:text-sm rounded-lg focus:bg-gray-200 focus:border-primary outline-none block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 active:border-primary dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Search for customers"
                            />
                        </div>
                    </form>
                </div>
                <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
                    <button
                        type="button"
                        onClick={handleAddCustomerButtonClick}
                        className="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary hover:bg-[#645de8e7] focus:ring-4 focus:ring-[#645de8e7] sm:w-auto dark:bg-primary dark:hover:bg-[#645de8e7] dark:focus:ring-[#645de8e7]"
                    >
                        <svg
                            className="w-5 h-5 mr-2 -ml-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Add Customer
                    </button>
                    <button
                        onClick={exportAsCSV}
                        className="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-100 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-transparent dark:text-white dark:border-zinc-500 dark:hover:bg-zinc-700 dark:focus:ring-zinc-700"
                    >
                        <svg
                            className="w-5 h-5 mr-2 -ml-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Export
                    </button>
                </div>
                <AddCustomer isVisible={isAddCustomerFormVisible} onClose={closeAddCustomerForm} />
            </div>
        </>
    )
}

export default CustomerHeader;