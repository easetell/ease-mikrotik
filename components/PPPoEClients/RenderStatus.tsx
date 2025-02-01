import React from "react";

const renderStockStatus = (stock: number) => {
  if (stock > 0) {
    return <span>{stock}</span>;
  } else {
    return (
      <span className="badge rounded bg-red-500 px-2 py-1 text-white">
        Out of Stock
      </span>
    );
  }
};

export default renderStockStatus;
