import { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

// Define types for the orders
type Order = {
  _id: string;
  customerName: string;
  placedBy: string;
  agentId: string;
  time: string;
  deliveryDate: string;
  products: {
    productName: string;
    quantity: number;
  }[];
  amount: number;
  paidAmount: number;
  discount: number;
  state: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type OrdersResponse = {
  orders: Order[];
};

const TotalSales: React.FC = () => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    { name: "Total Sales", data: [] },
    { name: "Total Debt", data: [] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  const [period, setPeriod] = useState("This Month");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/orders");
      const data: OrdersResponse = await response.json();

      // Process data to calculate total sales and debt for this month and last month by day
      const now = new Date();
      const thisMonth = now.getMonth();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const thisYear = now.getFullYear();
      const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;

      const dailySales: { [key: string]: number } = {};
      const dailyDebt: { [key: string]: number } = {};

      data.orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const orderDay = orderDate.getDate();
        const orderMonth = orderDate.getMonth();
        const orderYear = orderDate.getFullYear();

        const dateKey = `${orderYear}-${orderMonth + 1}-${orderDay}`;

        if (!dailySales[dateKey]) {
          dailySales[dateKey] = 0;
          dailyDebt[dateKey] = 0;
        }

        if (
          (orderMonth === thisMonth && orderYear === thisYear) ||
          (orderMonth === lastMonth && orderYear === lastYear)
        ) {
          dailySales[dateKey] += order.paidAmount;
          dailyDebt[dateKey] += order.amount - order.paidAmount; // Assuming debt is the remaining amount
        }
      });

      const sortedKeys = Object.keys(dailySales).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      const thisMonthKeys = sortedKeys.filter((key) => new Date(key).getMonth() === thisMonth);
      const lastMonthKeys = sortedKeys.filter((key) => new Date(key).getMonth() === lastMonth);

      setCategories(period === "This Month" ? thisMonthKeys : lastMonthKeys);

      setSeries([
        {
          name: "Total Sales",
          data: (period === "This Month" ? thisMonthKeys : lastMonthKeys).map((key) => dailySales[key]),
        },
        {
          name: "Total Debt",
          data: (period === "This Month" ? thisMonthKeys : lastMonthKeys).map((key) => dailyDebt[key]),
        },
      ]);
    };

    fetchData();
  }, [period]);

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
      },
      marker: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Sales Analytics
          </h4>
        </div>
        <div className="flex items-center gap-2.5">
          <p className="font-medium uppercase text-dark dark:text-dark-6">
            Show:
          </p>
          <DefaultSelectOption
            options={["This Month", "Last Month"]}
            onChange={(value: string) => setPeriod(value)}
          />
        </div>
      </div>
      <div>
        <div className="-ml-4 -mr-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
};

export default TotalSales;
