import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductsTable from "@/components/Products/Products";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
    title: "Products",
    description: "This is Products Page",
};

const ProductsPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Products" />

            <div className="flex flex-col gap-10">
                <ProductsTable />
            </div>
        </DefaultLayout>
    );
};

export default ProductsPage;