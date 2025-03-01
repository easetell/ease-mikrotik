import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { toast } from "react-toastify";
import { VoucherTypes } from "@/types/vouchers";
import generateVoucher from "@/utils/voucherGenerator";
import generateCheckoutRequestID from "@/utils/generateCheckoutRequestID";

interface AddVoucherProps {
  onClose: () => void;
  isVisible: boolean;
}

const AddVoucher: React.FC<AddVoucherProps> = ({ onClose, isVisible }) => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("EASETELL"); // Default password
  const [profile, setProfile] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [hotspotProfiles, setHotspotProfiles] = useState<VoucherTypes[]>([]);

  // Fetch billing plans
  const fetchData = useCallback(async () => {
    const hotspotProfilesResponse = await fetch("/api/hotspot-plans");
    const hotspotProfilesData = await hotspotProfilesResponse.json();
    setHotspotProfiles(hotspotProfilesData.hotspotProfiles);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate expiry time based on the selected profile's session-timeout
  const calculateExpiryTime = (sessionTimeout: string): Date => {
    const now = new Date();
    const timeoutMs = parseSessionTimeout(sessionTimeout);
    return new Date(now.getTime() + timeoutMs);
  };

  // Helper function to parse session-timeout
  const parseSessionTimeout = (timeout: string): number => {
    const unit = timeout.slice(-1); // Get the last character (h, m, s)
    const value = parseInt(timeout.slice(0, -1)); // Get the numeric value

    switch (unit) {
      case "h": // Hours
        return value * 60 * 60 * 1000;
      case "m": // Minutes
        return value * 60 * 1000;
      case "s": // Seconds
        return value * 1000;
      default:
        throw new Error(`Invalid session-timeout unit: ${unit}`);
    }
  };

  // Generate a voucher name when the placeholder is clicked
  const handleGenerateVoucher = () => {
    const voucherName = generateVoucher(); // Use the imported utility
    setName(voucherName);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Generate a random 10-digit checkoutRequestID
    const checkoutRequestID = generateCheckoutRequestID();

    // Find the selected profile
    const selectedProfile = hotspotProfiles.find(
      (plan) => plan.name === profile,
    );
    if (!selectedProfile) {
      toast.error("Please select a valid profile");
      return;
    }

    // Ensure the selected profile has a session-timeout
    if (!selectedProfile["session-timeout"]) {
      toast.error("Selected profile does not have a session-timeout");
      return;
    }

    // Calculate expiry time
    const expiryTime = calculateExpiryTime(selectedProfile["session-timeout"]);

    // Prepare voucher data
    const voucherData = {
      name,
      password,
      profile,
      phoneNumber,
      checkoutRequestID,
      status: "Active",
      createdAt: new Date(),
      expiryTime: expiryTime.toISOString(), // Send expiry time as ISO string
    };

    try {
      // Send voucher data to the backend API
      const response = await fetch("/api/vouchers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voucherData),
      });

      if (!response.ok) {
        throw new Error("Failed to add voucher");
      }

      toast.success("Voucher added successfully.", {
        onClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      console.error("Error adding voucher:", error);
      toast.error("Failed to add voucher");
    }
  };

  return (
    <div
      className={`fixed bottom-22 right-0 top-27 z-40 h-[calc(95vh-5rem)] w-full max-w-xs overflow-y-auto p-4 transition-transform ${
        isVisible ? "translate-x-0" : "translate-x-full"
      } bg-white dark:border-dark-3 dark:bg-gray-dark`}
    >
      <h5 className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        Add Voucher
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
              Voucher
            </label>
            <input
              type="text"
              id="name"
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Click to generate voucher"
              value={name}
              readOnly
              onClick={handleGenerateVoucher} // Generate voucher on click
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
              readOnly
              onChange={(e) => setPassword(e.target.value)}
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
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              required
            >
              <option value="">Select Plan</option>
              {hotspotProfiles.map((hotspotprofile) => (
                <option key={hotspotprofile._id} value={hotspotprofile.name}>
                  {hotspotprofile.name}
                </option>
              ))}
            </select>
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
              className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="pt-5">
          <button
            type="submit"
            className="focus:ring-primary-300 dark:focus:ring-primary-800 w-full justify-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#645de8e7] focus:outline-none focus:ring-4 dark:bg-primary dark:hover:bg-[#645de8e7]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVoucher;
