"use client";
import React from "react";
import ProductStock from "../Charts/ProductsStock";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import SalesPerAgent from "../Tables/SalesPerAgent";
import TotalSales from "../Charts/TotalSales";
import TotalSalesYearly from "../Charts/TotalSalesYearly";

const Analytics: React.FC = () => {
    return (
        <>
            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
                <TotalSalesYearly />
                <ChartTwo />
                <TotalSales />
                <ProductStock />
                <div className="col-span-12 xl:col-span-8">
                    <SalesPerAgent />
                </div>
                <ChatCard />
            </div>
        </>
    );
};

export default Analytics;
