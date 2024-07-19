"use client";
import React from "react";
import { MarketingCards } from "./MarketingCards";
import MarketingChart from "./MarketingChart";
import SideBox from "./SideBox";
import MarketingDownTable from "./MarketingDownTable";

const Marketing = () => {
  return (
    <>
      <MarketingCards />

      <div className="mt-2 grid grid-cols-12 gap-4 md:mt-5 md:gap-6 2xl:mt-2 2xl:gap-7.5">
        <MarketingChart />
        <SideBox />
      </div>
      <div className="pt-1">
        <MarketingDownTable />
      </div>
    </>
  );
};

export default Marketing;
