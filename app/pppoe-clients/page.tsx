import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PPPoETable from "@/components/Products/PPPoEs";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "PPPoE List",
  description: "This is PPPoE Clients List",
};

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="PPPoE List" />

      <div className="flex flex-col gap-10">
        <PPPoETable />
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
