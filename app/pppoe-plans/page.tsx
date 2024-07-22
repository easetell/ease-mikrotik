import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PPPoEPlansTable from "@/components/PPPoEPlans/PPPoEPlans";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "PPPoE Plans",
  description: "This is PPPoE Plans",
};

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="PPPoE Plans" />

      <div className="flex flex-col gap-10">
        <PPPoEPlansTable />
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
