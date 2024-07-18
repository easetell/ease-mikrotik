"use client"
import React, { useState } from 'react';
import AddProduct from './AddProduct';

interface ProductsHeaderProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ searchTerm, onSearchChange }) => {
    const [isAddFormVisible, setAddFormVisible] = useState(false);

    const handleAddButtonClick = () => {
        setAddFormVisible(true);
    };

    const closeAddForm = () => {
        setAddFormVisible(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    return (
        <>
            <div className="items-center justify-between block sm:flex">
                <div className="flex items-center mb-4 sm:mb-0">
                    <form className="sm:pr-3" action="#" method="GET">
                        <label htmlFor="products-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-48 mt-1 sm:w-64 xl:w-96">
                            <input
                                type="text"
                                id="products-search"
                                value={searchTerm}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-[#444444] text-dark sm:text-sm rounded-lg focus:bg-gray-200 focus:border-primary outline-none block w-full p-2.5 dark:bg-dark-2 dark:border-gray-600 dark:placeholder-gray-400 active:border-primary dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                                placeholder="Search for products"
                            />
                        </div>
                    </form>
                </div>
                <button
                    className="text-white dark:text-white bg-primary dark:bg-primary dark:hover:bg-[#645de8e7] hover:bg-[#645de8e7] font-medium rounded-lg text-sm px-5 py-2"
                    type="button"
                    onClick={handleAddButtonClick}
                >Add new product</button>

                <AddProduct isVisible={isAddFormVisible} onClose={closeAddForm} />
            </div>
        </>
    )
}

export default ProductsHeader