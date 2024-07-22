"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useUser, useSession } from "@clerk/nextjs";
import {
  LayoutDashboard,
  User2Icon,
  Settings,
  ShoppingCart,
  Users,
  LineChart,
  BookUser,
  Route,
  LogIn,
  ScrollText,
  MessagesSquare,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const { user } = useUser(); // Clerk user access
  const { session } = useSession(); // Clerk session access
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the user is an admin
  useEffect(() => {
    if (session) {
      const userRole = session?.user?.publicMetadata?.role;
      setIsAdmin(userRole === "admin");
    }
  }, [session]);

  const menuGroups = [
    {
      name: "MAIN MENU",
      menuItems: [
        {
          icon: <LayoutDashboard className="h-6 w-6" />,
          label: "Dashboard",
          route: "/",
        },
        {
          icon: <LineChart className="h-6 w-6" />,
          label: "Analytics",
          route: "/analytics",
          hidden: !isAdmin,
        },
        {
          icon: <Route className="h-6 w-6" />,
          label: "Fixed Broadband",
          route: "#",
          children: [
            {
              label: "PPPoE Clients",
              route: "/pppoe-clients",
            },
            {
              label: "PPPoE Plans",
              route: "/pppoe-plans",
            },
            {
              label: "Active Clients",
              route: "#",
            },
          ],
        },
        {
          icon: <ShoppingCart className="h-6 w-6" />,
          label: "Orders",
          route: "/orders",
        },
        {
          icon: <Users className="h-6 w-6" />,
          label: "Customers",
          route: "/customers",
        },
        {
          icon: <ScrollText className="h-6 w-6" />,
          label: "Invoices",
          route: "/invoice",
        },
        {
          icon: <BookUser className="h-6 w-6" />,
          label: "Agents",
          route: "/agents",
          hidden: !isAdmin,
        },
        // {
        //   icon: <AreaChart className="h-6 w-6" />,
        //   label: "Marketing",
        //   route: "#",
        //   children: [
        //     { label: "Marketing Analytics", route: "/marketing-analytics" },
        //     { label: "Campaign", route: "/campaign" },
        //   ],
        // },
      ],
    },
    {
      name: "OTHERS",
      menuItems: [
        {
          icon: <User2Icon className="h-6 w-6" />,
          label: "Profile",
          route: "/profile",
        },
        {
          icon: <Settings className="h-6 w-6" />,
          label: "Settings",
          route: "/user-profile",
        },
        {
          icon: <MessagesSquare className="h-6 w-6" />,
          label: "Support",
          route: "#",
        },
      ],
    },
  ];

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link className="flex items-center" href="/">
            <Image
              className="h-10 w-10 rounded-md"
              width={600}
              height={600}
              src="/images/logo/trans-1.png"
              alt="Logo"
            />
            <h1 className="ml-2 pl-4 text-xl font-semibold text-dark-4 dark:text-white">
              Ease CRM
            </h1>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map(
                    (menuItem, menuIndex) =>
                      (!menuItem.hidden || isAdmin) && (
                        <SidebarItem
                          key={menuIndex}
                          item={menuItem}
                          pageName={pageName}
                          setPageName={setPageName}
                        />
                      ),
                  )}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
