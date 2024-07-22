import React, { useState, FormEvent } from "react";
import { toast } from "react-toastify";

interface PlanProps {
  onClose: () => void;
  isVisible: boolean;
}

const AddPPPoEPlan: React.FC<PlanProps> = ({ onClose, isVisible }) => {
  const [name, setName] = useState<string>("");
  const [localAddress, setLocalAddress] = useState<string>("");
  const [rateLimit, setRateLimit] = useState<string>("");
  const [remoteAddress, setRemoteAddress] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [duration, setDuration] = useState<number>(30);
  const [moduleType, setModuleType] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const pppoePlanData = {
      "local-address": localAddress,
      name,
      "rate-limit": rateLimit,
      "remote-address": remoteAddress,
      price,
      duration,
      moduleType,
    };

    try {
      const response = await fetch("/api/pppoe-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pppoePlanData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Plan added successfully.", {
          onClose: () => {
            window.location.reload();
          },
        });
      } else {
        toast.error("Plan already exists");
      }
    } catch (error) {
      toast.error("An error occurred while creating the plan");
    }
  };

  return (
    <div
      className={`fixed bottom-22 right-0 top-27 z-40 h-[calc(95vh-5rem)] w-full max-w-xs overflow-y-auto p-4 transition-transform ${isVisible ? "translate-x-0" : "translate-x-full"} bg-white dark:border-dark-3 dark:bg-gray-dark`}
    >
      <h5 className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        Add PPPoE Plan
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
              htmlFor="localAddress"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Local Address
            </label>
            <input
              type="text"
              id="localAddress"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Local Address"
              value={localAddress}
              onChange={(e) => setLocalAddress(e.target.value)}
              required
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
              placeholder="Badwidth"
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="remoteAddress"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              IP Pool
            </label>
            <input
              type="text"
              id="remoteAddress"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="IP Pool"
              value={remoteAddress}
              onChange={(e) => setRemoteAddress(e.target.value)}
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
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="duration"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Duration
            </label>
            <input
              type="text"
              id="duration"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
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

export default AddPPPoEPlan;
