"use client";
import { useState } from "react";
import axios from "axios";

interface Package {
  name: string;
  price: number;
  duration: string;
  accNumber: string;
}

const packages: Package[] = [
  { name: "1 Hour", price: 10, duration: "1h", accNumber: "EASE1029" },
  { name: "24 Hours", price: 50, duration: "24h", accNumber: "EASE1028" },
  { name: "7 Days", price: 300, duration: "7d", accNumber: "EASE1027" },
  { name: "30 Days", price: 1000, duration: "30d", accNumber: "EASE1026" },
];

export default function HotspotLogin() {
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [voucher, setVoucher] = useState<string>("");
  const [showLogin, setShowLogin] = useState<boolean>(false);

  const handlePayment = async () => {
    if (!phone.match(/^254[17]\d{8}$/)) {
      setMessage(
        "Enter a valid Safaricom number (2547XXXXXXXX or 2541XXXXXXXX)",
      );
      return;
    }
    try {
      const response = await axios.post("/api/stkpush", {
        phone,
        amount: selectedPackage?.price,
        accountNumber: selectedPackage?.accNumber,
      });
      setMessage(response.data.message || "STK Push Sent! Enter code to login");
      setShowPopup(false); // Close the popup after payment initiation
    } catch (error) {
      setMessage("Payment request failed. Try again.");
    }
  };

  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowPopup(true);
  };

  const handleLogin = () => {
    if (voucher) {
      setShowLogin(true);
    } else {
      setMessage("Please complete the payment first.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-6 text-white">
      <h1 className="mb-4 text-3xl font-bold">Hotspot Access</h1>
      <p className="mb-4">
        Select a package and enter your phone number to pay via Mpesa.
      </p>

      {/* Package Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <button
            key={pkg.name}
            className="w-40 rounded-lg bg-indigo-500 p-3 text-white hover:bg-indigo-700"
            onClick={() => handlePackageClick(pkg)}
          >
            {pkg.name} - KES {pkg.price}
          </button>
        ))}
      </div>

      {/* Payment Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-bold">
              Purchase {selectedPackage?.name}
            </h2>
            <input
              type="tel"
              placeholder="Enter Safaricom Number (2547XXXXXXXX)"
              className="mb-4 w-full rounded-lg p-2 text-gray-900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                onClick={handlePayment}
              >
                Pay KES {selectedPackage?.price}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Section */}
      {showLogin ? (
        <div className="mt-6 rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-bold">Login to Hotspot</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value="EASETELL"
                readOnly
                className="w-full rounded-lg p-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="text"
                value={voucher}
                readOnly
                className="w-full rounded-lg p-2 text-gray-900"
              />
            </div>
            <button
              className="w-full rounded-lg bg-indigo-500 p-2 text-white hover:bg-indigo-700"
              onClick={() => alert("Redirecting to MikroTik Hotspot...")}
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <button
          className="mt-6 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-700"
          onClick={handleLogin}
        >
          Already Paid? Login Here
        </button>
      )}

      {/* Message Display */}
      {message && <p className="mt-4 text-yellow-300">{message}</p>}
    </div>
  );
}
