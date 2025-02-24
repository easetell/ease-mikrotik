import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import HotspotTable from "@/components/Hotspot/Hotspot";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Hotspot Plans",
  description: "Hotspot Plans Page",
};

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Hotspot Plans" />

      <div className="flex flex-col gap-10">
        <h1>Hotspot Plans</h1>
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
