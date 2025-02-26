"use client";
import { useState } from "react";
import axios from "axios";

interface Package {
  profile: string;
  price: number;
  duration: string;
}

const packages: Package[] = [
  { profile: "1 HOUR", price: 1, duration: "1h" },
  { profile: "2 HOURS", price: 2, duration: "2h" },
  { profile: "3 HOURS", price: 3, duration: "3h" },
  { profile: "4 HOURS", price: 4, duration: "4h" },
];

export default function HotspotLogin() {
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [name, setName] = useState<string>(""); // Add this line
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [alreadyPaidCheckoutRequestID, setAlreadyPaidCheckoutRequestID] =
    useState<string>("");
  const [showAlreadyPaidPopup, setShowAlreadyPaidPopup] =
    useState<boolean>(false);

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
        accountNumber: selectedPackage?.profile,
      });
      setMessage(response.data.message || "STK Push Sent! Enter code to login");
      setShowPopup(false); // Close the popup after payment initiation

      const checkoutRequestID = response.data.checkoutRequestID; // Get the CheckoutRequestID
      console.log("CheckoutRequestID:", checkoutRequestID); // Log CheckoutRequestID

      if (!checkoutRequestID) {
        throw new Error("CheckoutRequestID is missing in the response");
      }

      // Poll the backend for the voucher
      const pollForVoucher = async () => {
        const pollingInterval = setInterval(async () => {
          try {
            console.log("Polling for voucher..."); // Log polling attempt
            const voucherResponse = await axios.get(
              `/api/vouchers/${alreadyPaidCheckoutRequestID}`,
              {
                params: { checkoutRequestID },
              },
            );
            if (voucherResponse.data.name) {
              clearInterval(pollingInterval); // Stop polling
              console.log("✅ Voucher fetched:", voucherResponse.data.name); // Log fetched voucher
              setName(voucherResponse.data.name); // Set the name
              setShowLogin(true); // Show the login section
            }
          } catch (error) {
            console.error("Error fetching voucher:", error);
          }
        }, 5000); // Poll every 5 seconds
      };

      // Wait for 10 seconds before starting to poll (to allow callback to complete)
      setTimeout(pollForVoucher, 10000);
    } catch (error) {
      setMessage("Payment request failed. Try again.");
    }
  };

  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowPopup(true);
  };

  const handleAlreadyPaid = async () => {
    if (!alreadyPaidCheckoutRequestID) {
      setMessage("Enter a valid CheckoutRequestID.");
      return;
    }

    try {
      const nameResponse = await axios.get(
        `/api/vouchers/${alreadyPaidCheckoutRequestID}`,
        {
          params: { checkoutRequestID: alreadyPaidCheckoutRequestID },
        },
      );

      if (nameResponse.data.name) {
        setName(nameResponse.data.name); // Set the name
        setShowLogin(true); // Show the login section
        setShowAlreadyPaidPopup(false); // Close the popup
      } else {
        setMessage("No voucher found for the provided CheckoutRequestID.");
      }
    } catch (error) {
      setMessage("Error fetching voucher. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-6 text-white">
      <h1 className="mb-4 text-3xl font-bold">Easetell Networks Hotspot</h1>
      <p className="mb-4">
        Select a package and enter your phone number to pay via M-Pesa.
      </p>

      {/* User Instructions */}
      <div className="mb-8 w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">How to Purchase:</h2>
        <ol className="list-decimal space-y-3 pl-5 text-sm text-gray-300">
          <li>
            <span className="font-medium">Select a Package:</span> Choose a
            package from the options below that suits your needs.
          </li>
          <li>
            <span className="font-medium">Enter Your Phone Number:</span> After
            selecting a package, you will be prompted to enter your M-Pesa
            registered phone number.
          </li>
          <li>
            <span className="font-medium">Confirm Payment:</span> A payment
            request will be sent to your phone via M-Pesa. Enter your M-Pesa PIN
            to complete the payment.
          </li>
          <li>
            <span className="font-medium">Wait for Confirmation:</span> Once
            payment is successful, you will receive a Voucher.
          </li>
        </ol>
      </div>

      {/* Additional Instructions */}
      <div className="mb-8 w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Important Notes:</h2>
        <ul className="list-disc space-y-3 pl-5 text-sm text-gray-300">
          <li>
            <span className="font-medium">Misplaced Voucher?</span> If you
            misplaced your voucher, use the{" "}
            <span className="font-mono">CheckoutRequestID</span> you received to
            fetch the voucher you purchased.
          </li>
          <li>
            <span className="font-medium">Enable Promotion Messages:</span>{" "}
            Ensure you have enabled promotion messages on your phone number by
            dialing{" "}
            <span className="font-mono">
              <a
                href="tel:*456*9*5*5*1#"
                className="text-blue-400 hover:underline"
              >
                *456*9*5*5*1#
              </a>
            </span>
            .
          </li>
        </ul>
      </div>

      {/* Package Buttons */}
      <div className="grid grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.profile}
            className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg"
          >
            {/* Package Details */}
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {pkg.profile}
              </h3>
              <p className="text-sm text-gray-600">{pkg.duration}</p>
              <p className="text-sm text-gray-600">KES: {pkg.price}</p>
            </div>

            {/* Buy Button */}
            <button
              className="rounded-lg bg-green-500 px-6 py-2 text-white transition-colors duration-300 hover:bg-green-700"
              onClick={() => handlePackageClick(pkg)} // handlePackageClick function
            >
              Buy
            </button>
          </div>
        ))}
      </div>

      {/* Payment Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-bold">
              Purchase {selectedPackage?.profile}
            </h2>
            <input
              type="tel"
              placeholder="Enter Number (2547XXXXXXXX)"
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

      {/* Already Paid Popup */}
      {showAlreadyPaidPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-bold">Already Paid? Login Here</h2>
            <input
              type="text"
              placeholder="Enter CheckoutRequestID"
              className="mb-4 w-full rounded-lg p-2 text-gray-900"
              value={alreadyPaidCheckoutRequestID}
              onChange={(e) => setAlreadyPaidCheckoutRequestID(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                onClick={() => setShowAlreadyPaidPopup(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                onClick={handleAlreadyPaid}
              >
                Fetch Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Section */}
      {showLogin && name ? (
        <div className="mt-6 rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-bold">Login to Hotspot</h2>
          <div className="space-y-4">
            <div>
              <label className="block pb-3 text-sm font-medium">Voucher</label>
              <input
                type="text"
                value={name} // Password fetched from the database
                readOnly
                className="w-full rounded-lg p-2 text-gray-900"
              />
            </div>
            <div className="sr-only">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="text"
                value="EASETELL" // Default password
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
          onClick={() => setShowAlreadyPaidPopup(true)}
        >
          Already Paid? Login Here
        </button>
      )}

      {/* Message Display */}
      {message && <p className="mt-4 text-yellow-300">{message}</p>}

      {/* Smart Footer */}
      <footer className="mt-8 text-center text-sm text-gray-400">
        <p>
          Need help? Call our helpline:{" "}
          <a href="tel:0114241145" className="text-blue-400 hover:underline">
            0114241145
          </a>
        </p>
        <p className="mt-2">&copy; Easebill 2025. All rights reserved.</p>
      </footer>
    </div>
  );
}
