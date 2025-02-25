"use client";

import React from "react";
import { toast } from "react-toastify";

interface PlanProps {
  onClose: () => void;
  isVisible: boolean;
  selectedIdNo: string;
}

const DeleteItem: React.FC<PlanProps> = ({
  onClose,
  isVisible,
  selectedIdNo,
}) => {
  const deleteItem = async () => {
    try {
      const response = await fetch(`/api/hotspot-plans/${selectedIdNo}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Plan deleted successfully.", {
          onClose: () => {
            window.location.reload();
          },
        });
        onClose();
      } else {
        toast.error("Failed to delete Plan");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the Plan");
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-22 right-0 top-27 z-40 h-[calc(95vh-5rem)] w-full max-w-xs overflow-y-auto p-4 transition-transform ${isVisible ? "translate-x-0" : "translate-x-full"} bg-white dark:border-dark-3 dark:bg-gray-dark`}
      >
        <h5 className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
          Delete Plan
        </h5>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-stone-700 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <svg
          className="mb-4 mt-8 h-10 w-10 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mb-6 text-lg text-gray-500 dark:text-gray-400">
          WARNING !!! Are you sure you want to delete this Plan?
        </h3>
        <button
          onClick={deleteItem}
          className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
        >
          Yes I am sure
        </button>
        <button
          onClick={onClose}
          className="mr-2 inline-flex items-center rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-[#645de8e7] focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default DeleteItem;
