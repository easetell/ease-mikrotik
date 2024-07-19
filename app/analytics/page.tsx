import Analytics from "@/components/Analytics/Analytics";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
    title: "Analytics",
    description: "This is Analytics Page",
};

const AnalyticsPage = () => {
    return (
        <DefaultLayout>
            <Analytics />
        </DefaultLayout>
    );
};

export default AnalyticsPage;