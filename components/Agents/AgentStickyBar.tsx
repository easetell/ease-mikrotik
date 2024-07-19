import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AgentStickyBarProps {
    page: number;
    total: number;
    limit: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
}

export const AgentStickyBar: React.FC<AgentStickyBarProps> = ({ page, total, limit, onPreviousPage, onNextPage }) => {
    const totalPages = Math.ceil(total / limit);

    return (
        <>
            <div className="sticky bottom-0 right-0 items-center w-full p-4 bg-[#F7F9FC] dark:bg-boxdark border-t border-gray-200 sm:flex sm:justify-between dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
                <div className="flex items-center mb-4 sm:mb-0">
                    <button
                        onClick={onPreviousPage}
                        disabled={page <= 1}
                        className="inline-flex justify-center p-1 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={onNextPage}
                        disabled={page >= totalPages}
                        className="inline-flex justify-center p-1 mr-2 text-gray-400 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        <ChevronRight />
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                        Showing{" "}
                        <span className="font-semibold text-gray-600 dark:text-gray-200">
                            {(page - 1) * limit + 1}-{Math.min(page * limit, total)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-600 dark:text-gray-200">
                            {total}
                        </span>
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onPreviousPage}
                        disabled={page <= 1}
                        className="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary hover:bg-[#645de8e7] focus:ring-4 focus:ring-[#645de8e7] dark:bg-primary dark:hover:bg-[#645de8e7] dark:focus:ring-[#645de8e7]"
                    >
                        <svg
                            className="w-5 h-5 mr-1 -ml-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Previous
                    </button>
                    <button
                        onClick={onNextPage}
                        disabled={page >= totalPages}
                        className="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary hover:bg-[#645de8e7] focus:ring-4 focus:ring-[#645de8e7] dark:bg-primary dark:hover:bg-[#645de8e7] dark:focus:ring-[#645de8e7]"
                    >
                        Next
                        <svg
                            className="w-5 h-5 ml-1 -mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
}
