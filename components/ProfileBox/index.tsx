"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUser, useSession } from "@clerk/nextjs";
import { Agents } from "@/types/agents";

const ProfileBox = () => {
  const { user } = useUser(); // Clerk user access
  const { session } = useSession(); // Clerk session access
  const [agents, setAgents] = useState<Agents[]>([]);
  const [total, setTotal] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [agentData, setAgentData] = useState<Agents | null>(null);

  //Get Time
  const currentDateTime = new Date();
  const Time = currentDateTime.toLocaleString();

  // Fetch agents and set the state
  useEffect(() => {
    const fetchData = async () => {
      const agentResponse = await fetch("/api/agents");
      const agentData = await agentResponse.json();
      setAgents(agentData.agents);
      setTotal(agentData.total);
    };

    fetchData();
  }, []);

  const fromDate = agentData?.from ? new Date(agentData.from) : null;
  const toDate = agentData?.to ? new Date(agentData.to) : null;

  const fromDateString = fromDate ? fromDate.toLocaleDateString() : "";
  const toDateString = toDate ? toDate.toLocaleDateString() : "";

  // Check if the user is an admin
  useEffect(() => {
    if (session) {
      const userRole = session?.user?.publicMetadata?.role;
      setIsAdmin(userRole === "admin");
    }
  }, [session]);

  // Fetch agent data if the user is not an admin
  useEffect(() => {
    const fetchAgentData = async () => {
      if (!isAdmin && user?.id) {
        try {
          const response = await fetch(`/api/agents/${user.id}`);
          const data = await response.json();
          setAgentData(data.agent);
        } catch (error) {
          console.error("Error fetching agent data:", error);
        }
      }
    };

    fetchAgentData();
  }, [isAdmin, user?.id]);

  return (
    <>
      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src="/images/cover/ease-crm-cover.png"
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              {isAdmin && user?.imageUrl ? (
                <Image
                  width={170}
                  height={170}
                  src={user?.imageUrl || "/images/user/user-05.png"}
                  style={{
                    width: "auto",
                    height: "auto",
                  }}
                  alt="User"
                  className="overflow-hidden rounded-full"
                />
              ) : user?.imageUrl ? (
                <Image
                  width={170}
                  height={170}
                  src={user.imageUrl || "/images/user/user-05.png"}
                  style={{
                    width: "auto",
                    height: "auto",
                  }}
                  alt="User"
                  className="overflow-hidden rounded-full"
                />
              ) : (
                <p>No Pic</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {isAdmin ? user?.fullName : agentData?.agentName}
            </h3>
            <p className="font-medium">My Id: {user?.id}</p>
            <p className="font-medium">
              Email:{" "}
              {isAdmin
                ? user?.primaryEmailAddress?.emailAddress
                : agentData?.email}
            </p>
            {isAdmin ? null : (
              <div>
                <div className="mx-auto mb-5.5 mt-5 grid max-w-[550px] grid-cols-4 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-col">
                    <span className="text-body-lg text-dark dark:text-white">
                      Sales Target
                    </span>
                    <span className="font-medium text-dark dark:text-white">
                      Ksh.{" "}
                      {Intl.NumberFormat().format(Number(agentData?.target))}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-col">
                    <span className="text-body-lg text-dark dark:text-white">
                      Achieved
                    </span>
                    <span className="font-medium text-dark dark:text-white">
                      Ksh.{" "}
                      {Intl.NumberFormat().format(Number(agentData?.achieved))}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-col">
                    <span className="text-body-lg text-dark dark:text-white">
                      Region
                    </span>
                    <span className="font-medium text-dark dark:text-white">
                      {agentData?.region}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-col">
                    <span className="text-body-lg text-dark dark:text-white">
                      Status
                    </span>
                    <span className="font-medium text-dark dark:text-white">
                      {agentData?.status}
                    </span>
                  </div>
                </div>
                <div className="mx-auto max-w-[720px]">
                  <h4 className="font-medium text-dark dark:text-white">
                    Target Period
                  </h4>
                  <p className="mt-4">
                    <div className="relative">
                      <i>mm/dd/yy</i>
                    </div>
                    {fromDateString} to {toDateString}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileBox;
