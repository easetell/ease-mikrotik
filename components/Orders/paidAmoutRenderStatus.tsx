import React from 'react';

const paidStatus = (amount: number, paidamount: number) => {
    const formattedPaidAmount = Intl.NumberFormat().format(paidamount);
    if (paidamount < amount) {
        return <span className="text-red">Ksh. {formattedPaidAmount}</span>;
    } else {
        return <span>Ksh. {formattedPaidAmount}</span>;
    }
};

export default paidStatus;