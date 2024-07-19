import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Marketing from "@/components/Marketing/Marketing";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Marketing",
  description: "This is Marketing Page",
};

const MarketingPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Marketing" />

      <div className="flex flex-col gap-10">
        <Marketing />
      </div>
    </DefaultLayout>
  );
};

export default MarketingPage;
