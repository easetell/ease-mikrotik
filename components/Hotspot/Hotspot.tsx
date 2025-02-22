"use client";
import { useState } from "react";
import axios from "axios";

interface Package {
  name: string;
  price: number;
  duration: string;
}

const packages: Package[] = [
  { name: "1 Hour", price: 10, duration: "1h" },
  { name: "24 Hours", price: 50, duration: "24h" },
  { name: "7 Days", price: 300, duration: "7d" },
  { name: "30 Days", price: 1000, duration: "30d" },
];

export default function HotspotLogin() {
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handlePayment = async (packageData: Package) => {
    if (!phone.match(/^2547\d{8}$/)) {
      setMessage("Enter a valid Safaricom number (2547XXXXXXXX)");
      return;
    }
    try {
      const response = await axios.post("/api/stkpush", {
        phone,
        amount: packageData.price,
        package: packageData.name,
      });
      setMessage(response.data.message || "STK Push Sent! Enter code to login");
    } catch (error) {
      setMessage("Payment request failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-6 text-white">
      <h1 className="mb-4 text-3xl font-bold">Hotspot Access</h1>
      <p className="mb-4">
        Select a package and enter your phone number to pay via Mpesa.
      </p>
      <input
        type="tel"
        placeholder="Enter Safaricom Number (2547XXXXXXXX)"
        className="mb-4 w-full max-w-sm rounded-lg p-2 text-gray-900"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <button
            key={pkg.name}
            className="w-40 rounded-lg bg-indigo-500 p-3 text-white hover:bg-indigo-700"
            onClick={() => handlePayment(pkg)}
          >
            {pkg.name} - KES {pkg.price}
          </button>
        ))}
      </div>
      {message && <p className="mt-4 text-yellow-300">{message}</p>}
    </div>
  );
}
