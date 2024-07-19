import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useSession } from '@clerk/clerk-react';
import { Customer } from '@/types/customers';

interface EditCustomerProps {
    onClose: () => void;
    isVisible: boolean;
    selectedIdNo: string;
}

const EditCustomer: React.FC<EditCustomerProps> = ({ onClose, isVisible, selectedIdNo }) => {
    const { session } = useSession(); //clerk session
    const [isAdmin, setIsAdmin] = useState(false);
    const [customerItem, setCustomerItem] = useState<Customer | null>(null);
    const [formValues, setFormValues] = useState({
        customerName: '',
        email: '',
        phone: '',
        address: '',
        creditlimit: '',
    });

    useEffect(() => {
        if (session) {
            const userRole = session?.user?.publicMetadata?.role;
            setIsAdmin(userRole === 'admin');
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
                console.error('Failed to fetch customer:', error);
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
            toast.error('Sorry you do not have permission to edit customers.');
            return;
        }

        try {
            const response = await fetch(`/api/customers/${selectedIdNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
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
                toast.success('Customer edited successfully.', {
                    onClose: () => {
                        window.location.reload();
                    },
                });
            } else {
                toast.error('Failed to update customer');
            }
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };

    if (!customerItem) {
        return null;
    }

    return (
        <>
            <div
                className={`fixed top-27 bottom-22 right-0 z-40 w-full h-[calc(95vh-5rem)] max-w-xs p-4 overflow-y-auto transition-transform ${isVisible ? 'translate-x-0' : 'translate-x-full'} bg-white dark:bg-gray-dark dark:border-dark-3`}>
                <h5
                    className="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400"
                >Edit Customer</h5>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 bg-transparent hover:bg-stone-700 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg
                        aria-hidden="true"
                        className="w-5 h-5"
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
                            <label
                                className="block mb-2 text-sm font-medium text-dark dark:text-white"
                            >
                                Full Names
                            </label>
                            <input
                                type="text"
                                id="customerName"
                                name="customerName"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Customer Name"
                                value={formValues.customerName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm font-medium text-dark dark:text-white"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Email"
                                value={formValues.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm font-medium text-dark dark:text-white"
                            >
                                Phone
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Phone Number"
                                value={formValues.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm font-medium text-dark dark:text-white"
                            >
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Address"
                                value={formValues.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label
                                className="block mb-2 text-sm font-medium text-dark dark:text-white"
                            >
                                Credit Limit
                            </label>
                            <input
                                type="text"
                                id="creditlimit"
                                name="creditlimit"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Credit Limit"
                                value={formValues.creditlimit}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full justify-center text-white bg-primary hover:bg-[#645de8e7] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-[#645de8e7] dark:focus:ring-primary-800"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditCustomer;
