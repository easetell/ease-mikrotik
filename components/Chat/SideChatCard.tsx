"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import ChatCard from "./ChatCard";

const SidebarChat = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="hidden h-full flex-col xl:flex xl:w-1/4">
      <div className="sticky border-b border-stroke py-7.5 pl-6 pr-7.5 dark:border-dark-3">
        <h3 className="flex items-center justify-between text-lg font-medium text-dark dark:text-white 2xl:text-xl">
          Active Conversations
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-body-sm font-medium text-white">
            7
          </span>
        </h3>
      </div>
      <div className="flex max-h-full flex-col overflow-auto px-6 py-7.5">
        <form className="sticky mb-9">
          <input
            className="w-full rounded-[7px] border border-stroke bg-gray-2 py-2.5 pl-4.5 pr-12 text-body-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            placeholder="Search..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2">
            <Search className="fill-current" width="18" height="18" />
          </button>
        </form>
        <div className="no-scrollbar max-h-full overflow-auto">
          <ChatCard />
        </div>
      </div>
    </div>
  );
};

export default SidebarChat;
