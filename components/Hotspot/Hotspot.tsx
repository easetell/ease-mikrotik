"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VouchertickyBar } from "./VoucherStickyBar";
import PPPoEHeader from "./HotspotHeader";
import { VoucherTypes } from "@/types/vouchers";

const HotspotTable: React.FC = () => {
  const [vouchers, setVouchers] = useState<VoucherTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [isEditFormVisible, setEditFormVisible] = useState(false);
  const [selectedIdNo, setSelectedIdNo] = useState<string>("");
  const [isDeleteFormVisible, setDeleteFormVisible] = useState(false);

  useEffect(() => {
    // Fetch PPPoE and set the state
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/vouchers");
        const data = await response.data;
        setVouchers(data.vouchers); // Correctly set the vouchers
        setTotal(data.total);
      } catch (error) {
        toast.error("Failed to fetch data from server");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page on search
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedVouchers = filteredVouchers.slice(
    (currentPage - 1) * limit,
    currentPage * limit,
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * limit < filteredVouchers.length) {
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
      <PPPoEHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="overflow-auto shadow">
          <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                  Voucher
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                  Phone
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                  Plan
                </th>
                <th className="min-w-[180px] px-4 py-4 font-medium text-dark dark:text-white">
                  Date Created
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                  CheckoutRequestID
                </th>
                <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedVouchers.map((vouchergen) => (
                <tr key={vouchergen._id}>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {vouchergen.name}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {vouchergen.phoneNumber}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {vouchergen.profile}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {new Date(vouchergen.createdAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {vouchergen.checkoutRequestID}
                    </p>
                  </td>
                  <td className="space-x-2 whitespace-nowrap border-b border-[#eee] p-4 px-4 py-5 dark:border-dark-3">
                    <button
                      type="button"
                      onClick={() => handleEditButtonClick(vouchergen._id)}
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
                      onClick={() => handleDeleteButtonClick(vouchergen._id)}
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
                      Delete item
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <VouchertickyBar
          page={currentPage}
          total={filteredVouchers.length}
          limit={limit}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </div>
    </>
  );
};

export default HotspotTable;
