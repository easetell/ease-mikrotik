import React from 'react'

const renderStockStatus = (stock: number) => {
    if (stock > 0) {
        return <span>{stock}</span>;
    } else {
        return <span className="badge bg-red-500 text-white px-2 py-1 rounded">Out of Stock</span>;
    }
};

export default renderStockStatus;