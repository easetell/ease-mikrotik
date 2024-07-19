"use client"
import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useSession } from '@clerk/clerk-react';

interface RemoveOrderProps {
    onClose: () => void;
    isVisible: boolean;
    selectedIdNo: string;
}

const RemoveOrder: React.FC<RemoveOrderProps> = ({ onClose, isVisible, selectedIdNo }) => {

    const { session } = useSession();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (session) {
            const userRole = session?.user?.publicMetadata?.role;
            setIsAdmin(userRole === 'admin');
        }
    }, [session]);

    const deleteOrder = async () => {
        if (!isAdmin) {
            toast.error('Sorry you do not have permission to delete orders.');
            return;
        }

        try {
            const response = await fetch(`/api/orders/${selectedIdNo}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success("Order deleted successfully.", {
                    onClose: () => {
                        window.location.reload();
                    },
                });
                onClose();
            } else {
                toast.error('Failed to delete order');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the order');
        }
    };


    return (
        <>
            <div
                className={`fixed top-27 bottom-22 right-0 z-40 w-full h-[calc(95vh-5rem)] max-w-xs p-4 overflow-y-auto transition-transform ${isVisible ? 'translate-x-0' : 'translate-x-full'} bg-white dark:bg-gray-dark dark:border-dark-3`}>
                <h5
                    className="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400"
                >
                    Remove Order
                </h5>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 bg-transparent hover:bg-stone-700 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg
                        aria-hidden="true"
                        className="w-5 h-5"
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
                    className="w-10 h-10 mt-8 mb-4 text-red-600"
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
                    Are you sure you want to remove this Order?
                </h3>
                <button
                    onClick={deleteOrder}
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-red-900"
                >
                    Yes I am sure
                </button>
                <button
                    onClick={onClose}
                    className="text-white bg-primary hover:bg-[#645de8e7] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-blue-600"
                >
                    Cancel
                </button>

            </div>
        </>
    )
}

export default RemoveOrder;