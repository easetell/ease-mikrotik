"use client";
import React from "react";
import ChartTwo from "../Charts/ChartTwo";
import FourCards from "../DashboardFourCards/FourCards";
import TotalSales from "../Charts/TotalSales";

const Dashboard: React.FC = () => {
  return (
    <>
      <FourCards />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <TotalSales />
        <ChartTwo />
      </div>
      <div className="pt-8">
      </div>
    </>
  );
};

export default Dashboard;
