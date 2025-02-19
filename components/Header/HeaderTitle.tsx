import React, { useEffect, useState } from "react";

const HeaderTitle = () => {
  // State to store MikroTik system information
  const [mikrotikInfo, setMikrotikInfo] = useState<{
    identity: string;
    cpuUsage: string;
    uptime: string;
  } | null>(null);

  // State to handle loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch MikroTik system information
  const fetchMikrotikInfo = async () => {
    try {
      const response = await fetch("/api/system"); // Replace with your API route
      if (!response.ok) {
        throw new Error("Failed to fetch MikroTik system information");
      }
      const data = await response.json();
      setMikrotikInfo(data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching MikroTik information:", err);
      setError("Failed to load MikroTik information");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data initially and set up polling
  useEffect(() => {
    // Fetch data immediately
    fetchMikrotikInfo();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchMikrotikInfo, 3000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center">Loading...System Info</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex rounded-lg bg-gray-800 p-4 text-white shadow-lg">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-bold">{mikrotikInfo?.identity}</h1>
      </div>
    </div>
  );
};

export default HeaderTitle;
