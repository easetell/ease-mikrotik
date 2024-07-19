import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import dynamic from "next/dynamic";

const SmsCampaign = dynamic(
  () => import("@/components/Marketing/SmsCampaign"),
  {
    ssr: false,
  },
);

const EmailCampaign = dynamic(
  () => import("@/components/Marketing/EmailCampaign"),
  {
    ssr: false,
  },
);

export const metadata: Metadata = {
  title: "Campaign",
  description: "This is Campaign Page",
};

const CampaignPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Campaign" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <SmsCampaign />
        <EmailCampaign />
      </div>
    </DefaultLayout>
  );
};

export default CampaignPage;
