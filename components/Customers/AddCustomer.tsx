import React, { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";

interface AddCustomerProps {
    onClose: () => void;
    isVisible: boolean;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ onClose, isVisible }) => {

    //User who added the customer
    const { user } = useUser();

    const [inputValue, setInputValue] = useState<string>('');
    const [customerName, setCustomerName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/,/g, ''); // Remove existing commas

        if (!isNaN(Number(val))) { // Check if the input is a valid number
            val = val.toString(); // Convert value to string for manipulation
            if (val.length > 3) {
                let noCommas = Math.ceil(val.length / 3) - 1;
                let remain = val.length - (noCommas * 3);
                let newVal = [];
                for (let i = 0; i < noCommas; i++) {
                    newVal.unshift(val.substr(val.length - (i * 3) - 3, 3));
                }
                newVal.unshift(val.substr(0, remain));
                setInputValue(newVal.join(',')); // Format with commas
            } else {
                setInputValue(val); // Directly set value if less than 4 characters
            }
        } else {
            setInputValue(''); // Handle non-numeric inputs
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const creditlimit = parseFloat(inputValue.replace(/,/g, ''));

        const customerData = {
            customerName,
            agentId: user?.id,
            email,
            phone,
            address,
            creditlimit
        };

        try {
            const response = await fetch('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success("Customer added successfully.", {
                    onClose: () => {
                        window.location.reload();
                    },
                });
            } else {
                toast.error('Customer already exists');
            }
        } catch (error) {
            toast.error('An error occurred while creating the customer');
        }
    };


    return (
        <>
            <div
                className={`fixed top-27 bottom-22 right-0 z-40 w-full h-[calc(95vh-5rem)] max-w-xs p-4 overflow-y-auto transition-transform ${isVisible ? 'translate-x-0' : 'translate-x-full'} bg-white dark:bg-gray-dark dark:border-dark-3`}>
                <h5
                    className="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400"
                >Add Customer</h5>
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
                    <div className="space-y-4">
                        <div>
                            <label
                                className="block mb-2 text-sm font-medium text-dark dark:text-white"
                            >
                                Customer Name
                            </label>
                            <input
                                type="text"
                                id="customerName"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Customer Name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
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
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
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
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-dark dark:text-white"
                            >
                                Credit Limit
                            </label>
                            <input
                                type="text"
                                id="creditlimit"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Total Amount"
                                value={inputValue}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="bottom-0 left-0 flex justify-center w-full pb-4 mt-4 space-x-4 sm:absolute sm:px-4 sm:mt-0">
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
    )
}

export default AddCustomer;
