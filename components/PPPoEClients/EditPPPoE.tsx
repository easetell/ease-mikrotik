"use client";
import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import { toast } from "react-toastify";
import { PPPoE } from "@/types/pppoe";
import { Plans } from "@/types/plans";

interface EditPPPoEProps {
  selectedIdNo: string;
  isVisible: boolean;
  onClose: () => void;
}

const EditPPPoE: React.FC<EditPPPoEProps> = ({
  selectedIdNo,
  isVisible,
  onClose,
}) => {
  const [pppoeClient, setPppoeClient] = useState<PPPoE | null>(null);
  const [formValues, setFormValues] = useState({
    mikrotikId: "",
    name: "",
    password: "",
    service: "",
    "caller-id": "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    profile: "",
    expiryDate: "",
    location: "",
    idNumber: "",
  });
  const [billingPlans, setBillingPlans] = useState<Plans[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const billingPlansResponse = await fetch("/api/pppoe-plans");
      const billingPlansData = await billingPlansResponse.json();
      setBillingPlans(billingPlansData.billingPlans);
    } catch (error) {
      console.error("Failed to fetch billing plans:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchPppoe = async () => {
      try {
        const response = await fetch(`/api/pppoe-users/${selectedIdNo}`);
        if (!response.ok) {
          throw new Error("Failed to fetch PPPoE user");
        }
        const data = await response.json();
        if (!data.mikcustomer) {
          throw new Error("Mikcustomer not found in response");
        }
        setPppoeClient(data.mikcustomer);
        setFormValues({
          mikrotikId: data.mikcustomer.mikrotikId,
          name: data.mikcustomer.name,
          password: data.mikcustomer.password,
          service: data.mikcustomer.service,
          "caller-id": data.mikcustomer["caller-id"],
          firstName: data.mikcustomer.firstName,
          lastName: data.mikcustomer.lastName,
          phoneNumber: data.mikcustomer.phoneNumber,
          profile: data.mikcustomer.profile,
          expiryDate: data.mikcustomer.expiryDate,
          location: data.mikcustomer.location,
          idNumber: data.mikcustomer.idNumber,
        });
      } catch (error) {
        console.error("Failed to fetch PPPoE user:", error);
      }
    };

    if (selectedIdNo) {
      fetchPppoe();
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
      const response = await fetch(`/api/pppoe-users/${selectedIdNo}`, {
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
        toast.success("PPPoE user edited successfully.", {
          onClose: () => {
            window.location.reload();
          },
        });
      } else {
        toast.error("Failed to update PPPoE user");
      }
    } catch (error) {
      console.error("Error updating PPPoE user:", error);
    }
  };

  if (!pppoeClient) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-22 right-0 top-27 z-40 h-[calc(95vh-5rem)] w-full max-w-xs overflow-y-auto p-4 transition-transform ${
        isVisible ? "translate-x-0" : "translate-x-full"
      } bg-white dark:border-dark-3 dark:bg-gray-dark`}
    >
      <h5 className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        Edit PPPoE
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
        <div key={pppoeClient.mikrotikId} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Name"
              value={formValues.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Password
            </label>
            <input
              type="text"
              id="password"
              name="password"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Password"
              value={formValues.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="profile"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Plan
            </label>
            <select
              id="profile"
              name="profile"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              value={formValues.profile}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Plan</option>
              {billingPlans.map((billingplan) => (
                <option key={billingplan.mikrotikId} value={billingplan.name}>
                  {billingplan.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="caller-id"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Router Mac
            </label>
            <input
              type="text"
              id="caller-id"
              name="caller-id"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Router Mac"
              value={formValues["caller-id"]}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Phone Number"
              value={formValues.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Location"
              value={formValues.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="expiryDate"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Expiry Date"
              value={formValues.expiryDate}
              onChange={handleInputChange}
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

export default EditPPPoE;
