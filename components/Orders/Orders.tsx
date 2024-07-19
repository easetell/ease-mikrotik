"use client";
// Update the imports
import React, { useState, useEffect } from "react";
import { OrderStickyBar } from "./OrderStickyBar";
import EditOrder from "./EditOrder";
import RemoveOrder from "./RemoveOrder";
import OrderHeader from "./OrderHeader";
import renderStatusBadge from "./renderStatusBadge";
import paidStatus from "./paidAmoutRenderStatus";
import { useSession } from "@clerk/clerk-react";
import { Order } from "@/types/orders";

interface OrdersResponse {
  orders: Order[];
  total: number;
}

const OrdersTable: React.FC = () => {
  const { session } = useSession(); // Clerk session
  const [isAdmin, setIsAdmin] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [isEditFormVisible, setEditFormVisible] = useState(false);
  const [selectedIdNo, setSelectedIdNo] = useState<string>("");
  const [isDeleteFormVisible, setDeleteFormVisible] = useState(false);

  useEffect(() => {
    if (session) {
      const userRole = session?.user?.publicMetadata?.role;
      setIsAdmin(userRole === "admin");
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch orders and set the state
      const response = await fetch("/api/orders");
      const data: OrdersResponse = await response.json();
      const filteredOrders = isAdmin
        ? data.orders
        : data.orders.filter((order) => order.agentId === session?.user?.id);
      const sortedOrders = filteredOrders.sort(
        (a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setOrders(sortedOrders);
      setTotal(data.total);
    };

    fetchData();
  }, [isAdmin, session]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page on search
  };

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * limit,
    currentPage * limit,
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * limit < filteredOrders.length) {
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
      <OrderHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="overflow-auto shadow">
          <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                <th className="min-w-[180px] px-4 py-4 font-medium text-dark dark:text-white">
                  Customer
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                  Placed By
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                  Time
                </th>
                <th className="min-w-[200px] px-4 py-4 font-medium text-dark dark:text-white">
                  Products
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                  Amount
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                  Paid
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                  Delivery Date
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                  Status
                </th>
                <th className="min-w-[200px] px-4 py-4 font-medium text-dark dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((orderItem) => (
                <tr key={orderItem._id}>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {orderItem.customerName}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {orderItem.placedBy}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {orderItem.time}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <div className="space-y-2">
                      {orderItem.products.map((product, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium text-dark dark:text-white">
                            {product.productName}
                          </span>
                          <span className="font-medium text-dark dark:text-white">
                            x{product.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      Ksh. {Intl.NumberFormat().format(orderItem.amount)}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {paidStatus(orderItem.amount, orderItem.paidAmount)}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <h5 className="font-medium text-dark dark:text-white">
                      {new Date(orderItem.deliveryDate).toLocaleDateString()}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {renderStatusBadge(orderItem.state)}
                    </p>
                  </td>
                  <td className="space-x-2 whitespace-nowrap border-b border-[#eee] p-4 px-4 py-5 dark:border-dark-3">
                    <button
                      type="button"
                      onClick={() => handleEditButtonClick(orderItem._id)}
                      className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-white hover:bg-[#645de8e7] focus:ring-4 focus:ring-[#645de8e7] dark:bg-primary dark:hover:bg-[#645de8e7] dark:focus:ring-[#645de8e7]"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
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
                      onClick={() => handleDeleteButtonClick(orderItem._id)}
                      className="inline-flex items-center rounded-lg bg-red-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
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
                      Remove Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <EditOrder
            isVisible={isEditFormVisible}
            onClose={closeEditForm}
            selectedIdNo={selectedIdNo}
          />
          <RemoveOrder
            isVisible={isDeleteFormVisible}
            onClose={closeDeleteForm}
            selectedIdNo={selectedIdNo}
          />
        </div>
        <OrderStickyBar
          page={currentPage}
          total={filteredOrders.length}
          limit={limit}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </div>
    </>
  );
};

export default OrdersTable;
