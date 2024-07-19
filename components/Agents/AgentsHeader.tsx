"use client"
import React, { useState } from 'react';
import AddAgent from './AddAgent';

interface AgentsHeaderProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const AgentsHeader: React.FC<AgentsHeaderProps> = ({ searchTerm, onSearchChange }) => {
    const [isAddFormVisible, setAddFormVisible] = useState(false);

    const handleAddButtonClick = () => {
        setAddFormVisible(true);
    };

    const closeAddForm = () => {
        setAddFormVisible(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    return (
        <>
            <div className="items-center justify-between block sm:flex">
                <div className="flex items-center mb-4 sm:mb-0">
                    <form className="sm:pr-3" action="#" method="GET">
                        <label htmlFor="agents-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-48 mt-1 sm:w-64 xl:w-96">
                            <input
                                type="text"
                                id="agents-search"
                                value={searchTerm}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-[#444444] text-dark sm:text-sm rounded-lg focus:bg-gray-200 focus:border-primary outline-none block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 active:border-primary dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Search for agent"
                            />
                        </div>
                    </form>
                </div>
                <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
                    <button
                        type="button"
                        onClick={handleAddButtonClick}
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
                        Add Agent
                    </button>
                </div>
                <AddAgent isVisible={isAddFormVisible} onClose={closeAddForm} />
            </div>
        </>
    )
}

export default AgentsHeader;