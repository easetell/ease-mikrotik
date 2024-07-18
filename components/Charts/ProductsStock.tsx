import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";
import { ApexOptions } from "apexcharts";

const ProductStock: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [totalStock, setTotalStock] = useState(0);
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        // Log the response to check the structure
        // console.log('Fetched data:', data);

        // Assuming the response structure is { products: [{ _id, productName, stock, ... }], total: number }
        const products = data.products || [];
        const stocks = products.map((product: any) => product.stock);
        const productLabels = products.map((product: any) => product.productName);

        setProducts(products);
        setSeries(stocks);
        setLabels(productLabels);

        const total = stocks.reduce((acc: number, curr: number) => acc + curr, 0);
        setTotalStock(total);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#5750F1", "#7033FF", "#8099EC", "#EE33FF", "#33A7FF", "#3338FF", "#73CF64", "#6C8000"],
    labels: labels,
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Products",
              fontSize: "16px",
              fontWeight: "400",
              formatter: () => `${totalStock}`,
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  // Ensure options.colors is defined
  const colors = options.colors || ["#5750F1", "#7033FF", "#8099EC", "#EE33FF", "#33A7FF", "#3338FF", "#73CF64", "#6C8000"];

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Products Chart
          </h4>
        </div>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[350px]">
        <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
          {products.map((product, index) => (
            <div key={index} className="w-full px-7.5 sm:w-1/2">
              <div className="flex w-full items-center">
                <span
                  className={`mr-2 block h-3 w-full max-w-3 rounded-full`}
                  style={{
                    backgroundColor: (options.colors || ["#5750F1", "#7033FF", "#8099EC", "#EE33FF", "#33A7FF", "#3338FF", "#73CF64", "#6C8000"])[index % (options.colors || []).length]
                  }}
                ></span>
                <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                  <span> {product.productName} </span>
                  <span> {product.stock} </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductStock;