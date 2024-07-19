import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { UserProfile } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Profile Setting",
  description: "This is my profile",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile Setting" />
        <UserProfile path="/user-profile" />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
