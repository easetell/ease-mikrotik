import Dashboard from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

export const metadata: Metadata = {
  title: "Ease Bill",
  description:
    "Ease Bill is a comprehensive Customer Relationship Management solution designed to simplify and enhance the way businesses manage their interactions with current and potential customers.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </>
  );
}
