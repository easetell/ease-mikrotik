"use client";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import ReactToast from "@/components/react-toast";
// import { dark } from "@clerk/themes";
// import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 100);
  }, []);

  return (
    // <ClerkProvider
    //   appearance={{
    //     baseTheme: dark,
    //     signIn: { baseTheme: dark },
    //   }}
    // >
    <html lang="en">
      <head>
        <link rel="icon" href="./trans-1.png" />
      </head>
      <body suppressHydrationWarning={true}>
        {loading ? <Loader /> : children}
        <ReactToast />
      </body>
    </html>
    // </ClerkProvider>
  );
}
