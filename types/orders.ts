
export type ProductOrder = {
    productName: string;
    quantity: number;
};

export type Order = {
    _id: string;
    customerName: string;
    placedBy: string;
    agentId: string;
    time: string;
    products: ProductOrder[];
    amount: number;
    paidAmount: number;
    discount: number;
    deliveryDate: Date;
    state: string;
    createdAt: string;
    updatedAt: string;
};