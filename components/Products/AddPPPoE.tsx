import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";

interface AddPppoeProps {
  onClose: () => void;
  isVisible: boolean;
}

const AddPPPoE: React.FC<AddPppoeProps> = ({ onClose, isVisible }) => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [profile, setProfile] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [idNumber, setIdNumber] = useState<string>("");
  const [callerId, setCallerId] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const pppoeData = {
      name,
      password,
      service: "pppoe",
      "caller-id": callerId,
      firstName,
      lastName,
      phoneNumber,
      profile,
      expiryDate: new Date(expiryDate).toISOString(),
      location,
      idNumber,
    };

    try {
      const response = await fetch("/api/pppoe-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pppoeData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Client added successfully.", {
          onClose: () => {
            window.location.reload();
          },
        });
      } else {
        toast.error("Client already exists");
      }
    } catch (error) {
      toast.error("An error occurred while creating the client");
    }
  };

  return (
    <div
      className={`fixed bottom-22 right-0 top-27 z-40 h-[calc(95vh-5rem)] w-full max-w-xs overflow-y-auto p-4 transition-transform ${isVisible ? "translate-x-0" : "translate-x-full"} bg-white dark:border-dark-3 dark:bg-gray-dark`}
    >
      <h5 className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        Add PPPoE Client
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
              Name
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
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Password
            </label>
            <input
              type="text"
              id="password"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="profile"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Profile
            </label>
            <input
              type="text"
              id="profile"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Profile"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="callerId"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Router Mac
            </label>
            <input
              type="text"
              id="callerId"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Router Mac"
              value={callerId}
              onChange={(e) => setCallerId(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Phone
            </label>
            <input
              type="text"
              id="phoneNumber"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Expiry"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Building
            </label>
            <input
              type="text"
              id="location"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Building"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="idNumber"
              className="mb-2 block text-sm font-medium text-dark dark:text-white"
            >
              Id Number
            </label>
            <input
              type="text"
              id="idNumber"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Id Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </div>
        </div>
        <div>
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

export default AddPPPoE;
