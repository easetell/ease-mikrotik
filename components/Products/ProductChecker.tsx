import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

interface Product {
    productName: string;
    category: string;
    price: number;
    stock: number;
}

const ProductChecker: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Fetch products and set the state
        const fetchData = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data.products);
                setTotal(data.total);

                // Check stock levels and send notifications
                data.products.forEach(async (product: Product) => {
                    if (product.stock < 100) {
                        try {
                            const response = await axios.post('/api/send-notification', {
                                productName: product.productName,
                                category: product.category,
                                price: product.price,
                                stock: product.stock,
                            });

                            if (response.status === 200) {
                                toast.success(`Notification sent for ${product.productName}`);
                            } else {
                                toast.error(`Failed to send notification for ${product.productName}`);
                            }
                        } catch (error) {
                            toast.error(`Error sending notification for ${product.productName}`);
                        }
                    }
                });
            } catch (error) {
                toast.error('Error fetching products');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Product Level Checker</h1>
            <ul>
                {products.map((product, index) => (
                    <li key={index}>
                        {product.productName} - Stock: {product.stock}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductChecker;
