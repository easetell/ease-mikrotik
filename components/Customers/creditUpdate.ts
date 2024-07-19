import { useEffect, useCallback } from 'react';
import { Customer } from '@/types/customers';
import { Order } from '@/types/orders';

const fetchData = async () => {
    try {
        const customerResponse = await fetch('/api/customers');
        const customerData = await customerResponse.json();
        const customers: Customer[] = customerData.customers;

        const orderResponse = await fetch('/api/orders');
        const orderData = await orderResponse.json();
        const orders: Order[] = orderData.orders;

        return { customers, orders };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { customers: [], orders: [] };
    }
};

const calculateDebt = (orders: Order[], customerName: string) => {
    const customerOrders = orders.filter(order => order.customerName === customerName);
    const newDebt = customerOrders.reduce((acc, order) => {
        // Skip orders with a paidAmount of 0
        if (order.paidAmount === 0) {
            return acc;
        }
        return acc + (order.amount - order.paidAmount);
    }, 0);
    return newDebt;
};

const updateCustomerDebts = async (customers: Customer[], orders: Order[]) => {
    const updatedCustomers = await Promise.all(customers.map(async (customer) => {
        const newDebt = calculateDebt(orders, customer.customerName);
        if (customer.activedebt !== newDebt) {
            try {
                const response = await fetch(`/api/customers/${customer._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ activedebt: newDebt }),
                });
                if (response.ok) {
                    return { ...customer, activedebt: newDebt };
                } else {
                    console.error('Failed to update customer debt:', response.statusText);
                    return customer;
                }
            } catch (error) {
                console.error('Failed to update customer debt:', error);
                return customer;
            }
        }
        return customer;
    }));

    return updatedCustomers;
};

export const useDebtUpdateService = () => {
    const updateDebtsPeriodically = useCallback(() => {
        const intervalId = setInterval(async () => {
            const { customers, orders } = await fetchData();
            if (customers.length > 0 && orders.length > 0) {
                await updateCustomerDebts(customers, orders);
            }
        }, 60000); // Update every 60 seconds

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const clearUpdateInterval = updateDebtsPeriodically();

        return () => {
            clearUpdateInterval();
        };
    }, [updateDebtsPeriodically]);
};
