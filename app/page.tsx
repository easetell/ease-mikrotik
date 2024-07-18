import Dashboard from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

export const metadata: Metadata = {
  title: "Ease CRM",
  description:
    "Ease CRM is a comprehensive Customer Relationship Management solution designed to simplify and enhance the way businesses manage their interactions with current and potential customers.",
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
