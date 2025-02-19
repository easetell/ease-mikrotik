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
    setTimeout(() => setLoading(false), 100);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./trans-1.png" />
      </head>
      <body suppressHydrationWarning={true}>
        <ReactToast />
        {loading ? <Loader /> : children}
      </body>
    </html>
  );
}
