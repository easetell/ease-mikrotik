"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { HotspotPlansTypes } from "@/types/hotspotPlans";

interface PlanProps {
  selectedIdNo: string;
  isVisible: boolean;
  onClose: () => void;
}

const EditPlan: React.FC<PlanProps> = ({
  selectedIdNo,
  isVisible,
  onClose,
}) => {
  const [hotspotPlan, setHotspotplan] = useState<HotspotPlansTypes | null>(null);
  const [formValues, setFormValues] = useState({
    mikrotikId: "",
    name: "",
    "address-pool": "",
    "session-timeout": "",
    "shared-users": "",
    "rate-limit": "",
    price: "",
    moduleType: "",
  });

  useEffect(() => {
    const fetchHotspotPlan = async () => {
      try {
        const response = await fetch(`/api/hotspot-plans/${selectedIdNo}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Hotspot Plan");
        }
        const data = await response.json();
        if (!data.hotspotPlan) {
          throw new Error("HotspotPlan not found in response");
        }
        setHotspotplan(data.hotspotPlan);
        setFormValues({
          mikrotikId: data.hotspotPlan.mikrotikId,
          name: data.hotspotPlan.name,
          "address-pool": data.hotspotPlan["address-pool"],
          "session-timeout": data.hotspotPlan["session-timeout"],
          "shared-users": data.hotspotPlan["shared-users"],
          "rate-limit": data.hotspotPlan["rate-limit"],
          price: data.hotspotPlan.price,
          moduleType: data.hotspotPlan.moduleType,
        });
      } catch (error) {
        console.error("Failed to fetch PPPoE Plan:", error);
      }
    };

    if (selectedIdNo) {
      fetchHotspotPlan();
    }
  }, [selectedIdNo]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/hotspot-plans/${selectedIdNo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedIdNo,
          ...formValues,
        }),
      });

      if (response.ok) {
        toast.success("Hotspot Plan edited successfully.", {
          onClose: () => {
            window.location.reload();
          },
        });
      } else {
        toast.error("Failed to update Hotspot Plan");
      }
    } catch (error) {
      console.error("Error updating Hotspot Plan:", error);
    }
  };

  if (!hotspotPlan) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-22 right-0 top-27 z-40 h-[calc(95vh-5rem)] w-full max-w-xs overflow-y-auto p-4 transition-transform ${
        isVisible ? "translate-x-0" : "translate-x-full"
      } bg-white dark:border-dark-3 dark:bg-gray-dark`}
    >
      <h5 className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        Edit Plan
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
        <div key={hotspotPlan.mikrotikId} className="space-y-4">
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
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="address-pool"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Address Pool
            </label>
            <input
              type="text"
              id="address-pool"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Address Pool"
              name="address-pool"
              value={formValues["address-pool"]}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="session-timeout"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Duration
            </label>
            <input
              type="text"
              id="session-timeout"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="eg: 1h, 1d"
              name="session-timeout"
              value={formValues["session-timeout"]}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="shared-users"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Users
            </label>
            <input
              type="text"
              id="shared-users"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Users"
              name="shared-users"
              value={formValues["shared-users"]}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="rate-limit"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Bandwidth
            </label>
            <input
              type="text"
              id="rate-limit"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="eg: 1M/1M 1k/1k"
              name="rate-limit"
              value={formValues["rate-limit"]}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="Price"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Price
            </label>
            <input
              type="text"
              id="price"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Price"
              name="price"
              value={formValues.price}
              onChange={handleInputChange}
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
              name="moduleType"
              value={formValues.moduleType}
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
            submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlan;
