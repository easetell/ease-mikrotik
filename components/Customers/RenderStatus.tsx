import React from 'react';

const debtStatus = (activedebt: number) => {
    const formattedDebtAmount = Intl.NumberFormat().format(activedebt);
    if (activedebt === 0) {
        return <span className="badge bg-green-500 text-white px-2 py-1 rounded">Cleared</span>;
    } else {
        return <span>Ksh. {formattedDebtAmount}</span>;
    }
};

export default debtStatus;