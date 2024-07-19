import React, { useRef, useState, useEffect } from "react";
import { usePDF } from "react-to-pdf";
import { useUser } from "@clerk/nextjs";
import { useSession } from "@clerk/clerk-react";
import { Product } from "@/types/products";
import { Customer } from "@/types/customers";
import { Order } from "@/types/orders";

interface GenerateInvoiceProps {
  selectedIdNo: string;
  onClose: () => void;
  isVisible: boolean;
}

const Invoice: React.FC<GenerateInvoiceProps> = ({
  selectedIdNo,
  onClose,
  isVisible,
}) => {
  const { user } = useUser();
  const { session } = useSession(); // Clerk session

  const [isAdmin, setIsAdmin] = useState(false);

  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");

  const [time, setTime] = useState<string>(""); // Initialize empty
  const [state, setState] = useState<string>("Pending");
  const [id, setId] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<
    { productName: string; quantity: number; price: number; total: number }[]
  >([]);
  const [discount, setDiscount] = useState<number>(0);
  const [vat, setVat] = useState<number>(0);

  useEffect(() => {
    if (session) {
      const userRole = session?.user?.publicMetadata?.role;
      setIsAdmin(userRole === "admin");
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch("/api/products");
        if (!productResponse.ok) throw new Error("Failed to fetch products");
        const productData = await productResponse.json();
        setProducts(productData.products);

        const customerResponse = await fetch("/api/customers");
        if (!customerResponse.ok) throw new Error("Failed to fetch customers");
        const customerData = await customerResponse.json();
        setCustomers(customerData.customers);

        const orderResponse = await fetch("/api/orders");
        if (!orderResponse.ok) throw new Error("Failed to fetch orders");
        const orderData = await orderResponse.json();
        setOrders(orderData.orders);

        if (selectedIdNo) {
          const orderResponse = await fetch(`/api/orders/${selectedIdNo}`);
          if (!orderResponse.ok)
            throw new Error("Failed to fetch order details");
          const orderData = await orderResponse.json();

          if (orderData.order) {
            const {
              _id,
              customerName,
              time,
              state,
              paidAmount,
              products,
              discount,
              deliveryDate,
              amount,
              vat,
            } = orderData.order;
            setId(_id);
            setCustomerName(customerName);
            setTime(time);
            setState(state);
            setPaidAmount(paidAmount);
            setAmount(amount);
            setDiscount(discount);
            setVat(vat);
            setDeliveryDate(deliveryDate);

            // Fetch and set customer details based on customerName
            const selectedCustomer = customers.find(
              (customer) => customer.customerName === customerName,
            );
            if (selectedCustomer) {
              setCustomerEmail(selectedCustomer.email);
              setCustomerAddress(selectedCustomer.address);
              setCustomerPhone(selectedCustomer.phone);
            }

            // Fetch and set product details based on order items
            const updatedOrderItems = await Promise.all(
              products.map(
                async (orderItem: {
                  productName: string;
                  quantity: number;
                }) => {
                  const selectedProduct = productData.products.find(
                    (product: Product) =>
                      product.productName === orderItem.productName,
                  );
                  if (selectedProduct) {
                    const price = selectedProduct.price;
                    const total = orderItem.quantity * price;
                    return { ...orderItem, price, total };
                  } else {
                    throw new Error(
                      `Product not found: ${orderItem.productName}`,
                    );
                  }
                },
              ),
            );
            setOrderItems(updatedOrderItems);
          } else {
            throw new Error("Order data is not in the expected format");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedIdNo, customers]); // Added customers dependency

  const { toPDF, targetRef } = usePDF({ filename: "invoice.pdf" });

  // Calculate Subtotal
  const subtotal = orderItems.reduce((acc, item) => acc + item.total, 0);

  return (
    <>
      <div ref={targetRef}>
        {isVisible && (
          <div
            className="bottom-23 fixed right-0 top-27 z-40 overflow-y-auto overflow-x-hidden rounded-[10px] bg-white p-4 shadow-1 transition-transform dark:bg-gray-dark dark:shadow-card"
            style={{ maxHeight: "90vh" }} // Add this line
          >
            <div className="border-b border-stroke px-4 py-6 dark:border-dark-3 sm:px-6 xl:px-9">
              <h3 className="text-[22px] font-bold leading-7 text-dark dark:text-white">
                Invoice
              </h3>
            </div>
            <div className="p-4 sm:p-6 xl:p-9">
              <div className="mb-10 flex flex-wrap items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-stone-700 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 011.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Close menu</span>
                </button>
              </div>
              <div className="flex flex-wrap justify-between gap-5">
                {/* Billing From */}
                <div>
                  <p className="mb-1.5 font-medium text-dark dark:text-white">
                    Billing From:
                  </p>
                  <h4 className="mb-3 text-xl font-bold text-dark dark:text-white">
                    Soi Dairy Industries Limited
                  </h4>
                  <a className="block" href="#">
                    <span className="font-medium text-dark dark:text-white">
                      Email:
                    </span>
                    info@elgonvalley.com
                  </a>
                  <span className="mt-1.5 block">
                    <span className="font-medium text-dark dark:text-white">
                      Address:
                    </span>
                    Plot No 3008 Eldoret Kitale Road Webuye, Soy
                  </span>
                </div>
                {/* Billing To */}
                <div>
                  <p className="mb-1.5 font-medium text-dark dark:text-white">
                    Billing To:
                  </p>
                  <h4 className="mb-3 text-xl font-bold text-dark dark:text-white">
                    {customerName}
                  </h4>
                  <a className="block" href="#">
                    <span className="font-medium text-dark dark:text-white">
                      Email:
                    </span>
                    {customerEmail}
                  </a>
                  <span className="mt-1.5 block">
                    <span className="font-medium text-dark dark:text-white">
                      Address:
                    </span>
                    {customerAddress}
                  </span>
                  <span className="mt-1.5 block">
                    <span className="font-medium text-dark dark:text-white">
                      Phone:
                    </span>
                    {customerPhone}
                  </span>
                </div>
              </div>
              {/* Invoice Details */}
              <div className="my-7.5 grid grid-cols-1 border border-stroke dark:border-dark-3 xsm:grid-cols-2 sm:grid-cols-4">
                {/* Replace placeholder values with actual data */}
                <div className="border-b border-r border-stroke px-5 py-4 last:border-r-0 dark:border-dark-3 sm:border-b-0">
                  <h5 className="mb-1.5 font-bold text-dark dark:text-white">
                    Invoice ID :
                  </h5>
                  <span className="text-body-sm font-medium">{id}</span>
                </div>
                <div className="border-b border-stroke px-5 py-4 last:border-r-0 dark:border-dark-3 sm:border-b-0 sm:border-r">
                  <h5 className="mb-1.5 font-bold text-dark dark:text-white">
                    Date Issued :
                  </h5>
                  <span className="text-body-sm font-medium">{time}</span>
                </div>
                <div className="border-b border-r border-stroke px-5 py-4 last:border-r-0 dark:border-dark-3 xsm:border-b-0">
                  <h5 className="mb-1.5 font-bold text-dark dark:text-white">
                    Due Date :
                  </h5>
                  <span className="text-body-sm font-medium">
                    {new Date(deliveryDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="border-r border-stroke px-5 py-4 last:border-r-0 dark:border-dark-3">
                  <h5 className="mb-1.5 font-bold text-dark dark:text-white">
                    Due Amount :
                  </h5>
                  <span className="text-body-sm font-medium">
                    Ksh. {Intl.NumberFormat().format(amount - paidAmount)}
                  </span>
                </div>
              </div>
              {/* Invoice Items */}
              <div className="overflow-x-auto">
                <table className="mt-7.5 w-full border-collapse text-body-sm dark:border-dark-3">
                  <thead>
                    <tr>
                      <th className="border-b border-stroke px-5 pb-4 text-left dark:border-dark-3">
                        Item
                      </th>
                      <th className="border-b border-stroke px-5 pb-4 text-right dark:border-dark-3">
                        Quantity
                      </th>
                      <th className="border-b border-stroke px-5 pb-4 text-right dark:border-dark-3">
                        Price
                      </th>
                      <th className="border-b border-stroke px-5 pb-4 text-right dark:border-dark-3">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Replace with dynamic order items */}
                    {orderItems.map((item, index) => (
                      <tr key={index} className="border-b border-stroke">
                        <td className="px-5 py-3.5 text-dark dark:text-white">
                          {item.productName}
                        </td>
                        <td className="px-5 py-3.5 text-right text-dark dark:text-white">
                          {item.quantity}
                        </td>
                        <td className="px-5 py-3.5 text-right text-dark dark:text-white">
                          Ksh. {Intl.NumberFormat().format(item.price)}
                        </td>
                        <td className="px-5 py-3.5 text-right text-dark dark:text-white">
                          Ksh. {Intl.NumberFormat().format(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Invoice Summary */}
              <div className="mt-5 grid grid-cols-1 gap-5 pr-10">
                <div className="text-right">
                  <div className="mb-1.5 flex items-center justify-end gap-2.5">
                    <span className="font-bold text-dark dark:text-white">
                      Subtotal:
                    </span>
                    <span className="text-body-sm font-medium">
                      Ksh. {Intl.NumberFormat().format(subtotal)}
                    </span>
                  </div>
                  <div className="mb-1.5 flex items-center justify-end gap-2.5">
                    <span className="font-bold text-dark dark:text-white">
                      Discount:
                    </span>
                    <span className="text-body-sm font-medium text-green-600">
                      ({discount}%)
                    </span>
                  </div>
                  <div className="mb-1.5 flex items-center justify-end gap-2.5">
                    <span className="font-bold text-dark dark:text-white">
                      Vat:
                    </span>
                    <span className="text-body-sm font-medium text-red-600">
                      ({vat}%)
                    </span>
                  </div>
                  <div className="mb-1.5 flex items-center justify-end gap-2.5">
                    <span className="font-bold text-dark dark:text-white">
                      Total Amount:
                    </span>
                    <span className="text-body-sm font-medium">
                      Ksh. {Intl.NumberFormat().format(amount)}
                    </span>
                  </div>
                  <div className="mb-1.5 flex items-center justify-end gap-2.5">
                    <span className="font-bold text-dark dark:text-white">
                      Amount Paid:
                    </span>
                    <span className="text-body-sm font-medium">
                      Ksh. {Intl.NumberFormat().format(paidAmount)}
                    </span>
                  </div>
                  <div className="mb-1.5 flex items-center justify-end gap-2.5">
                    <p className="mt-4 flex justify-between space-x-3 border-t border-stroke pt-5 dark:border-dark-3">
                      <span className="font-bold text-dark dark:text-white">
                        Balance Due:
                      </span>
                      <span className="text-body-sm font-medium">
                        Ksh. {Intl.NumberFormat().format(amount - paidAmount)}
                      </span>
                    </p>
                  </div>
                  <div className="mt-10 flex flex-col justify-end gap-4 sm:flex-row">
                    <button
                      onClick={() => toPDF()}
                      className="flex items-center justify-center rounded-[7px] border border-primary px-7.5 py-2.5 text-center font-medium text-primary hover:bg-blue-light-5 dark:hover:border-primary dark:hover:bg-blue-light-3 dark:hover:text-primary"
                    >
                      Download Invoice
                    </button>
                    <button className="flex items-center justify-center rounded-[7px] bg-primary px-7.5 py-2.5 text-center font-medium text-gray-2 hover:bg-opacity-90">
                      Send Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Invoice;
