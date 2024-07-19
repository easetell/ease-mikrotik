
const renderStatusBadge = (status: string) => {
    switch (status) {
        case "Pending":
            return <span className="badge bg-yellow-500 text-white px-2 py-1 rounded">Pending</span>;
        case "Shipped":
            return <span className="badge bg-blue-500 text-white px-2 py-1 rounded">Shipped</span>;
        case "Delivered":
            return <span className="badge bg-green-500 text-white px-2 py-1 rounded">Delivered</span>;
        case "Cancelled":
            return <span className="badge bg-red-500 text-white px-2 py-1 rounded">Cancelled</span>;
        default:
            return <span className="badge bg-gray-500 text-white px-2 py-1 rounded">Unknown</span>;
    }
};

export default renderStatusBadge;