"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface Package {
  _id: string;
  name: string;
  price: number;
  "session-timeout": string;
}

export default function HotspotLogin() {
  const [phone, setPhone] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [name, setName] = useState<string>("");
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showAlreadyPaidPopup, setShowAlreadyPaidPopup] =
    useState<boolean>(false);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    // Fetch hotspot plans from the database
    const fetchHotspotPlans = async () => {
      try {
        const response = await axios.get("/api/hotspot-plans");
        setPackages(response.data.hotspotProfiles);
      } catch (error) {
        console.error("Error fetching hotspot plans:", error);
        toast.error("Failed to fetch hotspot plans. Please try again later.");
      }
    };

    fetchHotspotPlans();
  }, []);

  const handlePayment = async () => {
    if (!phone.match(/^254[17]\d{8}$/)) {
      toast.error(
        "Enter a valid Safaricom number (2547XXXXXXXX or 2541XXXXXXXX)",
      );
      return;
    }
    try {
      const response = await axios.post("/api/stkpush", {
        phone,
        amount: selectedPackage?.price,
        accountNumber: selectedPackage?.name,
      });
      toast.success("Check your phone and enter Mpesa-Pin");
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
            const voucherResponse = await axios.get("/api/getVoucher", {
              params: { checkoutRequestID },
            });
            if (voucherResponse.data.name) {
              clearInterval(pollingInterval); // Stop polling
              console.log("✅ Voucher fetched:", voucherResponse.data.name); // Log fetched voucher
              setName(voucherResponse.data.name); // Set the name
              setShowAlreadyPaidPopup(false); // Hide already paid popup if open
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
      toast.error("Payment request failed. Try again.");
    }
  };

  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowPopup(true);
  };

  // Function to handle automatic MikroTik Hotspot login
  const handleLogin = (): void => {
    if (!name) {
      toast.error("Please enter a voucher code.");
      return;
    }

    // Construct the login URL using the username from the input field
    const loginUrl = `http://ease.bill/login?username=${encodeURIComponent(name)}&password=EASETELL&dst=https://easetellnetworks.com&popup=true`;

    // Redirect user to the login URL
    window.location.href = loginUrl;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-6 text-white">
      <h1 className="mb-4 text-3xl font-bold">Easetell Hotspot</h1>
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
            registered phone number. (254112345678 / 254712345678)
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
      <div className="mb-8 w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg._id}
            className={`flex flex-col items-center justify-between rounded-lg bg-gray-900 p-4 transition-colors duration-300 ${index !== packages.length - 1 ? "mb-4" : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="w-full text-center">
              <h3 className="text-xl font-semibold text-blue-400">
                {pkg.name}
              </h3>
              <p className="text-gray-400">{pkg["session-timeout"]}</p>
            </div>

            <div className="mt-4 flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  KES {pkg.price}
                </span>
              </div>
              <motion.button
                className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePackageClick(pkg)}
              >
                Buy Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* <div className="mb-8 w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
        {packages.map((pkg, index) => (
          <div
            key={pkg._id}
            className={`flex flex-col items-center justify-between rounded-lg bg-gray-900 p-4 transition-colors duration-300 hover:bg-gray-700 sm:flex-row ${index !== packages.length - 1 ? "mb-4" : ""}`}
          >
            
            <div className="w-full text-center sm:text-left">
              <h3 className="text-xl font-semibold text-blue-400">
                {pkg.name}
              </h3>
              <p className="text-gray-400">{pkg["session-timeout"]}</p>
            </div>

            
            <div className="mt-5 flex w-full items-center justify-between sm:mt-0 sm:w-auto sm:gap-4">
              <span className="text-lg font-bold text-white">
                KES. {pkg.price}
              </span>
              <button
                className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-600"
                onClick={() => handlePackageClick(pkg)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div> */}

      {/* <div className="mb-8 w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
        {packages.map((pkg, index) => (
          <div
            key={pkg._id}
            className={`flex flex-col items-center justify-between rounded-lg bg-gray-700 p-4 transition-colors duration-300 hover:bg-gray-600 ${index !== packages.length - 1 ? "mb-4" : ""}`}
          >
            
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
              <span className="text-lg font-bold text-white">
                {pkg.price}/=
              </span>
            </div>

            
            <div className="w-full text-center">
              <h3 className="text-xl font-semibold text-blue-400">
                {pkg.name}
              </h3>
              <p className="text-gray-400">{pkg["session-timeout"]}</p>
            </div>

            
            <button
              className="mt-4 w-full rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-600"
              onClick={() => handlePackageClick(pkg)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div> */}

      {/* Payment Popup */}
      {showPopup && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="rounded-lg bg-gray-800 p-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h2 className="mb-4 text-xl font-bold">
              Purchase {selectedPackage?.name}
            </h2>
            <label className="block pb-3 text-sm font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter Number (2547XXXXXXXX)"
              className="mb-4 w-full rounded-lg p-2 text-gray-900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <motion.button
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePayment}
              >
                Pay KES {selectedPackage?.price}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Already Paid Popup */}
      {showAlreadyPaidPopup && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="rounded-lg bg-gray-800 p-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h2 className="mb-4 text-xl font-bold">Login to Hotspot</h2>
            <div className="space-y-4">
              <div>
                <label className="block pb-3 text-sm font-medium">
                  Voucher
                </label>
                <input
                  type="text"
                  placeholder="Enter Voucher"
                  className="w-full rounded-lg p-2 text-gray-900"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-8">
                <motion.button
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAlreadyPaidPopup(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogin}
                >
                  Login
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Login Section */}
      {showLogin && name ? (
        <motion.div
          className="mt-6 rounded-lg bg-gray-800 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-xl font-bold">Login to Hotspot</h2>
          <div className="space-y-4">
            <div>
              <label className="block pb-3 text-sm font-medium">Voucher</label>
              <input
                type="text"
                value={name}
                readOnly
                className="w-full rounded-lg p-2 text-gray-900"
              />
            </div>
            <motion.button
              className="w-full rounded-lg bg-indigo-500 p-2 text-white hover:bg-indigo-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogin}
            >
              Login
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          className="mt-6 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAlreadyPaidPopup(true)}
        >
          Already Paid? Login Here
        </motion.button>
      )}

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
