"use client"
import React, { useState, useEffect, FormEvent } from 'react';
import { toast } from "react-toastify";
import { useSession } from '@clerk/clerk-react';

interface AddAgentProps {
    onClose: () => void;
    isVisible: boolean;
}

const AddAgent: React.FC<AddAgentProps> = ({ onClose, isVisible }) => {
    const { session } = useSession(); // Clerk session
    const [agentId, setAgentId] = useState<string>('');
    const [agentName, setAgentName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [region, setRegion] = useState<string>('');
    const [achieved, setAchieved] = useState<number>(0);
    const [target, setTarget] = useState<number>(0);
    const [status, setStatus] = useState<string>('active');
    const [from, setFrom] = useState<string>('');
    const [to, setTo] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (session) {
            const userRole = session?.user?.publicMetadata?.role;
            setIsAdmin(userRole === 'admin');
        }
    }, [session]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!isAdmin) {
            toast.error('Sorry you do not have permission to add agent.');
            return;
        }

        const agentData = {
            agentId,
            agentName,
            phone,
            email,
            region,
            target,
            achieved,
            status,
            from,
            to
        };

        try {
            const response = await fetch('/api/agents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agentData),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success("Agent added successfully.", {
                    onClose: () => {
                        window.location.reload();
                    },
                });
            } else {
                toast.error('Agent id already exists');
            }
        } catch (error) {
            toast.error('An error occurred while adding the agent');
        }
    };

    return (
        <>
            <div
                className={`fixed top-27 bottom-22 right-0 z-40 w-full h-[calc(91vh-5rem)] max-w-xs p-4 overflow-y-auto transition-transform ${isVisible ? 'translate-x-0' : 'translate-x-full'} bg-white dark:bg-gray-dark dark:border-dark-3`}>
                <h5 className="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">Add Agent</h5>
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
                            <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                                Agent Id
                            </label>
                            <input
                                type="text"
                                id="agentId"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Agent Id"
                                value={agentId}
                                onChange={(e) => setAgentId(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="agentName"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Full Name"
                                value={agentName}
                                onChange={(e) => setAgentName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
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
                            <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="region"
                                className="block mb-2 text-sm font-medium text-dark dark:text-white"
                            >
                                Region
                            </label>
                            <input
                                type="text"
                                id="region"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                                Target Sales
                            </label>
                            <input
                                type="text"
                                id="target"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Target Sales"
                                value={target}
                                onChange={(e) => setTarget(Number(e.target.value))}
                                required
                            />
                        </div>
                        <div>
                            <label className="sr-only block mb-2 text-sm font-medium text-dark dark:text-white">
                                Achieved Sales
                            </label>
                            <input
                                type="text"
                                id="achieved"
                                value={achieved}
                                onChange={(e) => setAchieved(Number(e.target.value))}
                                className="sr-only overflow-auto bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Achieved Sales"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-dark dark:text-white">
                                Status
                            </label>
                            <select
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="active">active</option>
                                <option value="domant">domant</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                                From Date
                            </label>
                            <input
                                type="date"
                                id="from"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                                To Date
                            </label>
                            <input
                                type="date"
                                id="to"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
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
};

export default AddAgent;
