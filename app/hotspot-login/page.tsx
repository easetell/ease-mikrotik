import HotspotLogin from "@/components/Hotspot/HotspotLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotspot Login",
  description: "This is a Hotspot Login page",
};

const HotspotLoginPage = () => {
  return (
    <div className="flex flex-col gap-10">
      <HotspotLogin />
    </div>
  );
};

export default HotspotLoginPage;
