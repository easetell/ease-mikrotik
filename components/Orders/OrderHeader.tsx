"use client"
import React, { useState, useEffect } from 'react';
import PlaceOrder from './PlaceOrder';
import { Order } from '@/types/orders';
import { useSession } from '@clerk/clerk-react';
import { toast } from "react-toastify";

interface OrdersHeaderProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
};

interface OrdersResponse {
    orders: Order[];
    total: number;
}

const OrderHeader: React.FC<OrdersHeaderProps> = ({ searchTerm, onSearchChange }) => {
    const { session } = useSession(); // Clerk session
    const [isAdmin, setIsAdmin] = useState(false);

    const [isPlaceOrderFormVisible, setPlaceOrderFormVisible] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (session) {
            const userRole = session?.user?.publicMetadata?.role;
            setIsAdmin(userRole === 'admin');
        }
    }, [session]);

    const handlePlaceOrderButtonClick = () => {
        setPlaceOrderFormVisible(true);
    };

    const closePlaceOrderForm = () => {
        setPlaceOrderFormVisible(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            // Fetch orders and set the state
            const response = await fetch('/api/orders');
            const data: OrdersResponse = await response.json();
            const filteredOrders = isAdmin
                ? data.orders
                : data.orders.filter(order => order.agentId === session?.user?.id);
            setOrders(filteredOrders);
            setTotal(data.total);
        };

        fetchData();
    }, [isAdmin, session]);

    // Function to export data as CSV
    const exportAsCSV = () => {
        if (!isAdmin) {
            toast.error('You are not allowed to download the file');
            return; // Only admins can download the CSV
        }

        const csvContent = "data:text/csv;charset=utf-8,"
            + "Id,Customer,Placed By,Time,Products,Amount,Status\n"
            + orders.map(orderItem => {
                const productDetails = orderItem.products.map(product => `${product.productName} (${product.quantity})`).join(", ");
                return [
                    orderItem._id,
                    orderItem.customerName,
                    orderItem.placedBy,
                    orderItem.time,
                    productDetails,
                    orderItem.amount,
                    orderItem.state
                ]
                    .map(field => `"${String(field).replace(/"/g, '""')}"`) // Enclose in double quotes and escape existing double quotes
                    .join(",");
            }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "orders.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <>
            <div className="items-center justify-between block sm:flex">
                <div className="flex items-center mb-4 sm:mb-0">
                    <form className="sm:pr-3" action="#" method="GET">
                        <label htmlFor="orders-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-48 mt-1 sm:w-64 xl:w-96">
                            <input
                                type="text"
                                id="orders-search"
                                value={searchTerm}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-[#444444] text-dark sm:text-sm rounded-lg focus:bg-gray-200 focus:border-primary outline-none block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 active:border-primary dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Search for orders"
                            />
                        </div>
                    </form>
                </div>
                <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
                    <button
                        type="button"
                        onClick={handlePlaceOrderButtonClick}
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
                        Place Order
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
                <PlaceOrder isVisible={isPlaceOrderFormVisible} onClose={closePlaceOrderForm} />
            </div>
        </>
    )
}

export default OrderHeader