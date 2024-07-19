const renderStatusBadge = (status: string) => {
    switch (status) {
        case "active":
            return <span className="badge bg-green-500 text-white px-2 py-1 rounded">active</span>;
        case "domant":
            return <span className="badge bg-red-500 text-white px-2 py-1 rounded">domant</span>;
        default:
            return <span className="badge bg-gray-500 text-white px-2 py-1 rounded">Unknown</span>;
    }
};

export default renderStatusBadge;