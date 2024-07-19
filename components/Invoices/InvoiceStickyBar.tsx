import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InvoiceStickyBarProps {
  page: number;
  total: number;
  limit: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const InvoiceStickyBar: React.FC<InvoiceStickyBarProps> = ({
  page,
  total,
  limit,
  onPreviousPage,
  onNextPage,
}) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="dark:bg-boxdark sticky bottom-0 right-0 w-full items-center border-t border-gray-200 bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card sm:flex sm:justify-between">
      <div className="mb-4 flex items-center sm:mb-0">
        <button
          onClick={onPreviousPage}
          disabled={page <= 1}
          className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-400 hover:bg-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={onNextPage}
          disabled={page >= totalPages}
          className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-400 hover:bg-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
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
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-white hover:bg-[#645de8e7] focus:ring-4 focus:ring-[#645de8e7] dark:bg-primary dark:hover:bg-[#645de8e7] dark:focus:ring-[#645de8e7]"
        >
          <svg
            className="-ml-1 mr-1 h-5 w-5"
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
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-white hover:bg-[#645de8e7] focus:ring-4 focus:ring-[#645de8e7] dark:bg-primary dark:hover:bg-[#645de8e7] dark:focus:ring-[#645de8e7]"
        >
          Next
          <svg
            className="-mr-1 ml-1 h-5 w-5"
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
  );
};
