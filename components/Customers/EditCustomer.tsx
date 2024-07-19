import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "@clerk/clerk-react";
import { Customer } from "@/types/customers";

interface EditCustomerProps {
  onClose: () => void;
  isVisible: boolean;
  selectedIdNo: string;
}

const EditCustomer: React.FC<EditCustomerProps> = ({
  onClose,
  isVisible,
  selectedIdNo,
}) => {
  const { session } = useSession(); //clerk session
  const [isAdmin, setIsAdmin] = useState(false);
  const [customerItem, setCustomerItem] = useState<Customer | null>(null);
  const [formValues, setFormValues] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    creditlimit: "",
  });

  useEffect(() => {
    if (session) {
      const userRole = session?.user?.publicMetadata?.role;
      setIsAdmin(userRole === "admin");
    }
  }, [session]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customers/${selectedIdNo}`);
        const data = await response.json();
        setCustomerItem(data.customer);
        setFormValues({
          customerName: data.customer.customerName,
          email: data.customer.email,
          phone: data.customer.phone,
          address: data.customer.address,
          creditlimit: data.customer.creditlimit.toString(),
        });
      } catch (error) {
        console.error("Failed to fetch customer:", error);
      }
    };

    if (selectedIdNo) {
      fetchCustomer();
    }
  }, [selectedIdNo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAdmin) {
      toast.error("Sorry you do not have permission to edit customers.");
      return;
    }

    try {
      const response = await fetch(`/api/customers/${selectedIdNo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedIdNo,
          customerName: formValues.customerName,
          email: formValues.email,
          phone: formValues.phone,
          address: formValues.address,
          creditlimit: parseFloat(formValues.creditlimit),
        }),
      });

      if (response.ok) {
        toast.success("Customer edited successfully.", {
          onClose: () => {
            window.location.reload();
          },
        });
      } else {
        toast.error("Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  if (!customerItem) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed bottom-22 right-0 top-27 z-40 h-[calc(95vh-5rem)] w-full max-w-xs overflow-y-auto p-4 transition-transform ${isVisible ? "translate-x-0" : "translate-x-full"} bg-white dark:border-dark-3 dark:bg-gray-dark`}
      >
        <h5 className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
          Edit Customer
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
          <div key={customerItem._id} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Full Names
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Customer Name"
                value={formValues.customerName}
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
                id="email"
                name="email"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Email"
                value={formValues.email}
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
                id="phone"
                name="phone"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Phone Number"
                value={formValues.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Address"
                value={formValues.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Credit Limit
              </label>
              <input
                type="text"
                id="creditlimit"
                name="creditlimit"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Credit Limit"
                value={formValues.creditlimit}
                onChange={handleInputChange}
                required
              />
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

export default EditCustomer;
