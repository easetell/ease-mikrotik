"use client";

import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import ReactToast from "@/components/react-toast";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 60);

    // Fetch API to trigger the disconnect function
    fetch("/api/cron-check")
      .then((res) => res.json())
      .then((data) => console.log("Disconnect API response:", data))
      .catch((error) => console.error("Error calling disconnect API:", error));
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./trans-1.png" />
      </head>
      <body suppressHydrationWarning={true}>
        {loading ? <Loader /> : children}
        <ReactToast />
      </body>
    </html>
  );
}
