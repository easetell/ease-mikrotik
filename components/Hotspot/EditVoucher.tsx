"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";

interface Voucher {
  id: string;
  name: string;
  password: string;
  profile: string;
  checkoutRequestID: string; // Unique identifier
  expiryTime: string; // Expiry time in the format "MM/DD/YYYY, HH:MM:SS AM/PM"
}

interface Props {
  selectedIdNo: string;
  isVisible: boolean;
  onClose: () => void;
}

const EditVoucher: React.FC<Props> = ({ selectedIdNo, isVisible, onClose }) => {
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [formValues, setFormValues] = useState({
    expiryTime: "", // Expiry time in the format "YYYY-MM-DDTHH:MM"
  });

  // Fetch the voucher details
  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await fetch(`/api/vouchers/${selectedIdNo}`);
        if (!response.ok) {
          throw new Error("Failed to fetch voucher");
        }
        const data = await response.json();
        setVoucher(data);
        // Convert the expiry time to the format expected by datetime-local input
        const expiryDate = new Date(data.expiryTime);
        const formattedExpiryTime = expiryDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
        setFormValues({
          expiryTime: formattedExpiryTime,
        });
      } catch (error) {
        console.error("Failed to fetch voucher:", error);
      }
    };

    if (selectedIdNo) {
      fetchVoucher();
    }
  }, [selectedIdNo]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!voucher) {
      toast.error("Voucher not found");
      return;
    }

    try {
      // Format the expiry time for MikroTik comment
      const expiryDate = new Date(formValues.expiryTime);
      const formattedExpiryTime = expiryDate.toLocaleString("en-US", {
        timeZone: "Africa/Nairobi", // Use East African Time (EAT)
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Use 12-hour format (AM/PM)
      });

      // Update the voucher in the database and re-add it to MikroTik
      const response = await fetch(`/api/vouchers/${selectedIdNo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expiryTime: formattedExpiryTime, // Update the expiryTime field
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update voucher");
      }

      toast.success("Voucher updated and re-added to MikroTik successfully.", {
        onClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      console.error("Error updating voucher:", error);
      toast.error("Failed to update voucher");
    }
  };

  if (!voucher) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-22 right-0 top-27 z-40 h-[calc(95vh-5rem)] w-full max-w-xs overflow-y-auto p-4 transition-transform ${
        isVisible ? "translate-x-0" : "translate-x-full"
      } bg-white dark:border-dark-3 dark:bg-gray-dark`}
    >
      <h5 className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        Edit Voucher Expiry
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
      <form onSubmit={handleSubmit}>
        <div key={voucher.id} className="space-y-4">
          <div>
            <label
              htmlFor="expiryTime"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Expiry Time
            </label>
            <input
              type="datetime-local"
              id="expiryTime"
              name="expiryTime"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              value={formValues.expiryTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="pt-5">
          <button
            type="submit"
            className="focus:ring-primary-300 dark:focus:ring-primary-800 w-full justify-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#645de8e7] focus:outline-none focus:ring-4 dark:bg-primary dark:hover:bg-[#645de8e7]"
          >
            Update Voucher
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVoucher;
