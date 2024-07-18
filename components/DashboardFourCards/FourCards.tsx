import React, { useState, useEffect } from 'react';
import { dataStats } from "@/types/dataStats";
import { Product } from '@/types/products';
import { Order } from '@/types/orders';
import { Customer } from '@/types/customers';
import {
  Archive,
  Users,
  BadgeDollarSign,
  Box
} from "lucide-react";

const FourCards: React.FC<dataStats> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [productQuantity, setProductQuantity] = useState<number>(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [customersCount, setCustomersCount] = useState<number>(0);
  const [totalActiveDebt, setTotalActiveDebt] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productResponse = await fetch('/api/products');
        const productData = await productResponse.json();
        setProducts(productData.products);
        setTotal(productData.total);

        // Calculate total quantity of products
        const quantity = productData.products.reduce((acc: number, product: Product) => acc + product.stock, 0);
        setProductQuantity(quantity);

        // Fetch orders
        const orderResponse = await fetch('/api/orders');
        const orderData = await orderResponse.json();
        setOrders(orderData.orders);

        // Log order data to debug
        console.log('Order data:', orderData);

        // Calculate total shipped orders and pending orders
        const pendingCount = orderData.orders.filter((order: Order) => order.state === 'Pending').length;
        setPendingOrdersCount(pendingCount);

        // Fetch customers
        const customerResponse = await fetch('/api/customers');
        const customerData = await customerResponse.json();
        setCustomers(customerData.customers);
        setCustomersCount(customerData.customers.length);

        // Calculate total active debt from all customers with positive activedebt
        const totalDebt = customerData.customers
          .filter((customer: Customer) => customer.activedebt > 0) // Filter only positive debts
          .reduce((acc: number, customer: Customer) => acc + customer.activedebt, 0);
        setTotalActiveDebt(totalDebt);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const dataStatsList = [
    {
      icon: (
        <BadgeDollarSign className="text-white" width="26" height="26" />
      ),
      color: "#18BFFF",
      title: "Total Debt",
      value: Intl.NumberFormat().format(totalActiveDebt),
      growthRate: 23,
    },
    {
      icon: (
        <Archive className="text-white" width="26" height="26" />
      ),
      color: "#ebb734",
      title: "Pending Orders",
      value: pendingOrdersCount.toString(),
      growthRate: 0.43,
    },
    {
      icon: (
        <Users className="text-white" width="26" height="26" />
      ),
      color: "#073494",
      title: "Customers",
      value: customersCount.toString(),
      growthRate: 4.35,
    },
    {
      icon: (
        <Box className="text-white" width="26" height="26" />
      ),
      color: "#8155FF",
      title: "Total Product",
      value: productQuantity.toString(),
      growthRate: 2.59,
    },
  ];

  return (
    <>
      <div>
        {/* Your other components */}
        <div className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {dataStatsList.map((item, index) => (
            <div
              key={index}
              className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
            >
              <div
                className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                    {item.value}
                  </h4>
                  <span className="text-body-sm font-medium">{item.title}</span>
                </div>

                <span
                  className={`sr-only flex items-center gap-1.5 text-body-sm font-medium ${item.growthRate > 0 ? "text-green" : "text-red"
                    }`}
                >
                  {item.growthRate}%
                  {item.growthRate > 0 ? (
                    <svg
                      className="fill-current"
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.35716 2.3925L0.908974 5.745L5.0443e-07 4.86125L5 -5.1656e-07L10 4.86125L9.09103 5.745L5.64284 2.3925L5.64284 10L4.35716 10L4.35716 2.3925Z"
                        fill=""
                      />
                    </svg>
                  ) : (
                    <svg
                      className="fill-current"
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.64284 7.6075L9.09102 4.255L10 5.13875L5 10L-8.98488e-07 5.13875L0.908973 4.255L4.35716 7.6075L4.35716 7.6183e-07L5.64284 9.86625e-07L5.64284 7.6075Z"
                        fill=""
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FourCards;
