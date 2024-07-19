import React, { useState, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { useSession } from "@clerk/clerk-react";
import { Product } from "@/types/products";
import { Customer } from "@/types/customers";
import { Order } from "@/types/orders";

interface EditOrderProps {
  selectedIdNo: string;
  onClose: () => void;
  isVisible: boolean;
}

const EditOrder: React.FC<EditOrderProps> = ({
  selectedIdNo,
  onClose,
  isVisible,
}) => {
  const { user } = useUser();
  const { session } = useSession(); // Clerk session
  const [isAdmin, setIsAdmin] = useState(false);

  const [customerName, setCustomerName] = useState<string>("");
  const [time, setTime] = useState<string>(""); // Initialize empty
  const [state, setState] = useState<string>("Pending");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [discount, setDiscount] = useState<number>(0); // Discount state
  const [vat, setVat] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<
    { productName: string; quantity: number }[]
  >([]);

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
              customerName,
              time,
              state,
              paidAmount,
              products,
              discount,
              vat,
            } = orderData.order;
            setCustomerName(customerName);
            setTime(time);
            setState(state);
            setPaidAmount(paidAmount);
            setOrderItems(products);
            setDiscount(discount);
            setVat(vat);
          } else {
            throw new Error("Order data is not in the expected format");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedIdNo]);

  const handleAddProduct = () => {
    setOrderItems([...orderItems, { productName: "", quantity: 0 }]);
  };

  const handleRemoveProduct = (index: number) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
  };

  const handleProductChange = (index: number, productName: string) => {
    const updatedItems = orderItems.map((item, i) =>
      i === index ? { ...item, productName } : item,
    );
    setOrderItems(updatedItems);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedItems = orderItems.map((item, i) =>
      i === index ? { ...item, quantity } : item,
    );
    setOrderItems(updatedItems);
  };

  const calculateDebt = (orders: Order[], customerName: string) => {
    return orders
      .filter((order) => order.customerName === customerName)
      .reduce((acc, order) => acc + (order.amount - order.paidAmount), 0);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      toast.error("Sorry, you do not have permission to edit orders.");
      return;
    }

    const customer = customers.find((c) => c.customerName === customerName);

    if (!customer) {
      toast.error("Customer not found, add customer first");
      return;
    }

    const totalAmount = orderItems.reduce((acc, item) => {
      const product = products.find((p) => p.productName === item.productName);
      if (product) {
        return acc + product.price * item.quantity;
      }
      return acc;
    }, 0);

    // Calculate the discount amount
    const discountAmount = Math.floor((totalAmount * discount) / 100);
    const finalDiscountAmount = totalAmount - discountAmount;

    // Calculate VAT amount
    const vatAmount = Math.floor((finalDiscountAmount * vat) / 100);
    const finalAmount = finalDiscountAmount + vatAmount;

    for (const item of orderItems) {
      const product = products.find((p) => p.productName === item.productName);
      if (!product) {
        toast.error(`Product ${item.productName} not found`);
        return;
      }
      if (product.stock < item.quantity) {
        toast.error(
          `Not enough ${item.productName} remaining ${product.stock} in stock`,
        );
        return;
      }
    }

    const customerActiveDebt = customer.activedebt;
    const customerCreditLimit = customer.creditlimit;
    const presentDebt = totalAmount - paidAmount;
    const newDebt = customerActiveDebt + presentDebt;

    if (newDebt > customerCreditLimit) {
      toast.error(`Credit limit exceeded for ${customerName}`);
      return;
    }

    const orderData = {
      customerName,
      placedBy: user?.fullName,
      agentId: user?.id,
      time,
      products: orderItems,
      amount: finalAmount,
      paidAmount,
      state,
      discount,
      vat,
    };

    try {
      const response = await fetch(`/api/orders/${selectedIdNo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Order updated successfully.", {
          onClose: () => {
            window.location.reload();
          },
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update order");
      }
    } catch (error) {
      toast.error("An error occurred while updating the order");
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-22 right-0 top-27 z-40 h-[calc(91vh-5rem)] w-full max-w-xs overflow-y-auto p-4 transition-transform ${isVisible ? "translate-x-0" : "translate-x-full"} bg-white dark:border-dark-3 dark:bg-gray-dark`}
      >
        <h5 className="mb-6 inline-flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
          Edit Order
        </h5>
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
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="customerName"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                Customer Name
              </label>
              <select
                id="customerName"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer.customerName}>
                    {customer.customerName}
                  </option>
                ))}
              </select>
            </div>
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-1">
                  <label
                    htmlFor={`productName-${index}`}
                    className="mb-2 block text-sm font-medium text-dark dark:text-white"
                  >
                    Product Name
                  </label>
                  <select
                    id={`productName-${index}`}
                    className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                    value={item.productName}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product.productName}>
                        {product.productName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor={`quantity-${index}`}
                    className="mb-2 block text-sm font-medium text-dark dark:text-white"
                  >
                    Quantity
                  </label>
                  <input
                    type="text"
                    id={`quantity-${index}`}
                    className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, Number(e.target.value))
                    }
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <div>
              <button
                type="button"
                onClick={handleAddProduct}
                className="text-blue-600 hover:text-blue-800"
              >
                Add Product
              </button>
            </div>
            <div>
              <label
                htmlFor="discount"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                Discount (%)
              </label>
              <input
                type="text"
                id="discount"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Discount"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div>
              <label
                htmlFor="vat"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                VAT (%)
              </label>
              <input
                type="text"
                id="vat"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="VAT"
                value={vat}
                onChange={(e) => setVat(Number(e.target.value))}
              />
            </div>
            <div>
              <label
                htmlFor="paidAmount"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                Paid Amount
              </label>
              <input
                type="text"
                id="paidAmount"
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Paid Amount"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                Status
              </label>
              <select
                id="state"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="focus:ring-primary-300 dark:focus:ring-primary-800 w-full justify-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#645de8e7] focus:outline-none focus:ring-4 dark:bg-primary dark:hover:bg-[#645de8e7]"
              >
                Update Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditOrder;
