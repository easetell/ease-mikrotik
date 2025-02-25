"use client";
import React, { useState, FormEvent } from "react";
import { toast } from "react-toastify";

interface PlanProps {
  onClose: () => void;
  isVisible: boolean;
}

const AddHotspotPlan: React.FC<PlanProps> = ({ onClose, isVisible }) => {
  // State variables for the Hotspot profile fields
  const [name, setName] = useState<string>("");
  const [addressPool, setAddressPool] = useState<string>("");
  const [sessionTimeout, setSessionTimeout] = useState<string>("");
  const [sharedUsers, setSharedUsers] = useState<number>(1);
  const [rateLimit, setRateLimit] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [moduleType, setModuleType] = useState<string>("prepaid");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare the data for the Hotspot profile
    const hotspotProfileData = {
      name,
      "address-pool": addressPool,
      "session-timeout": sessionTimeout,
      "shared-users": sharedUsers,
      "rate-limit": rateLimit,
      price,
      moduleType,
    };

    try {
      // Send a POST request to the API endpoint
      const response = await fetch("/api/hotspot-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hotspotProfileData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Hotspot Profile added successfully.", {
          onClose: () => {
            window.location.reload(); // Reload the page to reflect changes
          },
        });
      } else {
        toast.error("Failed to add Hotspot Profile. Please check the data.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while creating the Hotspot Profile.");
    }
  };

  return (
    <div
      className={`fixed bottom-22 right-0 top-27 z-40 h-[calc(95vh-5rem)] w-full max-w-xs overflow-y-auto p-4 transition-transform ${isVisible ? "translate-x-0" : "translate-x-full"} bg-white dark:border-dark-3 dark:bg-gray-dark`}
    >
      <h5 className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        Add Hotspot Plan
      </h5>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-stone-700 hover:text-dark dark:hover:bg-gray-600 dark:hover:text-white"
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
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Plan Name
            </label>
            <input
              type="text"
              id="name"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="addressPool"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Address Pool
            </label>
            <input
              type="text"
              id="addressPoollocalAddress"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Address Pool"
              value={addressPool}
              onChange={(e) => setAddressPool(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="sessionTimeout"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Duration
            </label>
            <input
              type="text"
              id="sessionTimeout"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="eg: 1h, 1d"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="sharedUsers"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Users
            </label>
            <input
              type="text"
              id="sharedUsers"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Shared Users"
              value={sharedUsers}
              onChange={(e) => setSharedUsers(Number(e.target.value))} // Convert string to number
            />
          </div>
          <div>
            <label
              htmlFor="rateLimit"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Bandwidth
            </label>
            <input
              type="text"
              id="rateLimit"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="eg: 1M/1M 1k/1k"
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Price
            </label>
            <input
              type="text"
              id="price"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label
              htmlFor="moduleType"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Module Type
            </label>
            <input
              type="text"
              id="moduleType"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Module Type"
              value={moduleType}
              onChange={(e) => setModuleType(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="pt-5">
          <button
            type="submit"
            className="focus:ring-primary-300 dark:focus:ring-primary-800 w-full justify-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#645de8e7] focus:outline-none focus:ring-4 dark:bg-primary dark:hover:bg-[#645de8e7]"
          >
            submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHotspotPlan;
