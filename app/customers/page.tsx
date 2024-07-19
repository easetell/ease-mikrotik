import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CustomerTable from "@/components/Customers/Customers";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
    title: "Customer",
    description: "This is Customer Page",
};

const CustomerPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Customer" />

            <div className="flex flex-col gap-10">
                <CustomerTable />
            </div>
        </DefaultLayout>
    );
};

export default CustomerPage;