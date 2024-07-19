import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AgentsTable from "@/components/Agents/Agents";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
    title: "Sales Agents",
    description: "This Sales Agents Page",
};

const UsersPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Sales Agents" />

            <div className="flex flex-col gap-10">
                <AgentsTable />
            </div>
        </DefaultLayout>
    );
};

export default UsersPage;