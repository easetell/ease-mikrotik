import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useSession } from '@clerk/clerk-react';
import { Product } from '@/types/products';
import { EditProductProps } from '@/types/EditProductProps';

const EditProduct: React.FC<EditProductProps> = ({ onClose, isVisible, selectedIdNo }) => {
    const { session } = useSession(); //clerk session
    const [isAdmin, setIsAdmin] = useState(false);
    const [productItem, setProductItem] = useState<Product | null>(null);
    const [formValues, setFormValues] = useState({
        productName: '',
        price: '',
        category: '',
        stock: '',
    });

    useEffect(() => {
        if (session) {
            const userRole = session?.user?.publicMetadata?.role;
            setIsAdmin(userRole === 'admin');
        }
    }, [session]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${selectedIdNo}`);
                const data = await response.json();
                setProductItem(data.product);
                setFormValues({
                    productName: data.product.productName,
                    price: data.product.price.toString(),
                    category: data.product.category,
                    stock: data.product.stock.toString(),
                });
            } catch (error) {
                console.error('Failed to fetch product:', error);
            }
        };

        if (selectedIdNo) {
            fetchProduct();
        }
    }, [selectedIdNo]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isAdmin) {
            toast.error('Sorry you do not have permission to edit products.');
            return;
        }

        try {
            const response = await fetch(`/api/products/${selectedIdNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedIdNo,
                    productName: formValues.productName,
                    price: parseFloat(formValues.price),
                    category: formValues.category,
                    stock: parseInt(formValues.stock, 10),
                }),
            });

            if (response.ok) {
                toast.success('Product edited successfully.', {
                    onClose: () => {
                        window.location.reload();
                    },
                });
            } else {
                toast.error('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    if (!productItem) {
        return null;
    }

    return (
        <>
            <div
                className={`fixed top-27 bottom-22 right-0 z-40 w-full h-[calc(95vh-5rem)] max-w-xs p-4 overflow-y-auto transition-transform ${isVisible ? 'translate-x-0' : 'translate-x-full'} bg-white dark:bg-gray-dark dark:border-dark-3`}>
                <h5 className="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">
                    Edit Product
                </h5>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 bg-transparent hover:bg-stone-700 hover:text-dark rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg
                        aria-hidden="true"
                        className="w-5 h-5"
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
                    <div key={productItem._id} className="space-y-4">
                        <div>
                            <label
                                htmlFor="productName"
                                className="block mb-2 text-sm font-medium text-dark dark:text-white dark:bg-boxdark"
                            >
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="productName"
                                id="productName"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Product Name"
                                required
                                value={formValues.productName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="price"
                                className="block mb-2 text-sm font-medium text-dark dark:text-white dark:bg-boxdark"
                            >
                                Price
                            </label>
                            <input
                                type="text"
                                name="price"
                                id="price"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Price"
                                required
                                value={formValues.price}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="category"
                                className="block mb-2 text-sm font-medium text-dark dark:text-white dark:bg-boxdark"
                            >
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                id="category"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Category"
                                required
                                value={formValues.category}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="stock"
                                className="block mb-2 text-sm font-medium text-dark dark:text-white dark:bg-boxdark"
                            >
                                Stock
                            </label>
                            <input
                                type="text"
                                name="stock"
                                id="stock"
                                className="bg-gray-50 border border-gray-300 text-dark text-sm rounded-lg focus:border-primary outline-none focus:ring-primary-600 block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Stock"
                                required
                                value={formValues.stock}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="bottom-0 left-0 flex justify-center w-full pb-4 mt-4 space-x-4 sm:absolute sm:px-4 sm:mt-0">
                        <button
                            type="submit"
                            className="w-full justify-center text-white bg-primary hover:bg-[#645de8e7] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-[#645de8e7] dark:focus:ring-primary-800"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProduct;
