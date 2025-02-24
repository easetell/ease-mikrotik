import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import HotspotTable from "@/components/Hotspot/Hotspot";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Hotspot Users",
  description: "Hotspot Users Page",
};

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Hotspot Users" />

      <div className="flex flex-col gap-10">
        <HotspotTable />
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
