import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import HotspotTable from "@/components/Hotspot/Hotspot";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Hotspot Top-Ups",
  description: "Hotspot Top-Ups Page",
};

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Hotspot Top-Ups" />

      <div className="flex flex-col gap-10">
        <h1>Hotspot Top-Ups</h1>
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
