import React, { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useSession } from "@clerk/clerk-react";
import { Agents } from "@/types/agents";

interface EditAgentProps {
  onClose: () => void;
  isVisible: boolean;
  selectedIdNo: string; // Assuming this is passed as a string
}

const EditAgent: React.FC<EditAgentProps> = ({
  onClose,
  isVisible,
  selectedIdNo,
}) => {
  const { session } = useSession(); // Clerk session
  const [isAdmin, setIsAdmin] = useState(false);
  const [agentItem, setAgentItem] = useState<Agents | null>(null);
  const [formValues, setFormValues] = useState({
    agentName: "",
    phone: "",
    email: "",
    region: "",
    target: "",
    achieved: "",
    status: "",
    from: "",
    to: "",
  });

  useEffect(() => {
    if (session) {
      const userRole = session?.user?.publicMetadata?.role;
      setIsAdmin(userRole === "admin");
    }
  }, [session]);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/agents/${selectedIdNo}`);
        const data = await response.json();
        setAgentItem(data.agent);
        setFormValues({
          agentName: data.agent.agentName,
          phone: data.agent.phone,
          email: data.agent.email,
          target: data.agent.target,
          region: data.agent.region,
          achieved: data.agent.achieved,
          status: data.agent.status,
          from: data.agent.from,
          to: data.agent.to,
        });
      } catch (error) {
        console.error("Failed to fetch agent:", error);
      }
    };

    if (selectedIdNo) {
      fetchAgent();
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

    if (!isAdmin) {
      toast.error("Sorry, you do not have permission to edit agents.");
      return;
    }

    try {
      const response = await fetch(`/api/agents/${selectedIdNo}`, {
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
        toast.success("Agent edited successfully.", {
          onClose: () => {
            window.location.reload();
          },
        });
      } else {
        toast.error("Failed to update agent");
      }
    } catch (error) {
      console.error("Error updating agent:", error);
    }
  };

  if (!agentItem) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed bottom-22 right-0 top-27 z-40 h-[calc(91vh-5rem)] w-full max-w-xs overflow-y-auto p-4 transition-transform ${isVisible ? "translate-x-0" : "translate-x-full"} bg-white dark:border-dark-3 dark:bg-gray-dark`}
      >
        <h5 className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
          Edit Agent
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
          <div key={agentItem.agentId} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                name="agentName"
                id="agentName"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Full Name"
                value={formValues.agentName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Phone"
                value={formValues.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Email"
                value={formValues.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="region"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                Assign Region
              </label>
              <input
                type="text"
                name="region"
                id="region"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Region"
                value={formValues.region}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Target Sales
              </label>
              <input
                type="text"
                name="target"
                id="target"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="target"
                value={formValues.target}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="sr-only mb-2 block text-sm font-medium text-dark dark:text-white">
                Achieved Sales
              </label>
              <input
                type="text"
                name="achieved"
                id="achieved"
                className="focus:ring-primary-600 sr-only block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="achieved sales"
                value={formValues.achieved}
                required
              />
            </div>
            <div>
              <label
                htmlFor="from"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                From Date
              </label>
              <input
                type="date"
                name="from"
                id="from"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                value={formValues.from}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="to"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                To Date
              </label>
              <input
                type="date"
                name="to"
                id="to"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                value={formValues.to}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                Status
              </label>
              <select
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                value={formValues.status}
                onChange={handleInputChange}
                name="status"
                id="status"
              >
                <option value="active">active</option>
                <option value="domant">domant</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="focus:ring-primary-300 dark:focus:ring-primary-800 w-full justify-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#645de8e7] focus:outline-none focus:ring-4 dark:bg-primary dark:hover:bg-[#645de8e7]"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditAgent;
