"use client";
import Link from "next/link";
import React from "react";
import Login from "../Login";

export default function LoginPage() {
  return (
    <>
      {/* <GoogleSigninButton text="Sign in" /> */}
      <div>
        <Login />
      </div>
      <div className="mt-6 text-center text-white">
        <p>
          Don’t have any account?{" "}
          <Link href="#" className="text-white">
            Contact Us
          </Link>
        </p>
      </div>
    </>
  );
}
