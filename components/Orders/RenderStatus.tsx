import React from 'react'

const renderStockStatus = (stock: number) => {
    if (stock > 0) {
        return <span>{stock}</span>;
    } else {
        return <span className="rounded-full text-white badge bg-red-600 text-xs px-2 pb-1">out of stock</span>;
    }
};

export default renderStockStatus;