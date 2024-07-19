import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InvoiceTable from "@/components/Invoices/SalesInvoices";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Invoices",
  description: "This is Invoice Page",
};

const OrdersPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Invoices" />

      <div className="flex flex-col gap-10">
        <InvoiceTable />
      </div>
    </DefaultLayout>
  );
};

export default OrdersPage;
