import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import OrdersTable from "@/components/Orders/Orders";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
    title: "Orders",
    description: "This is Orders Page",
};

const OrdersPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Orders" />

            <div className="flex flex-col gap-10">
                <OrdersTable />
            </div>
        </DefaultLayout>
    );
};

export default OrdersPage;