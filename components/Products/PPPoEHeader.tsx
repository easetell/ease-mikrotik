"use client";
import React, { useState } from "react";
import AddPPPoE from "./AddPPPoE";

interface PPPoEHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const PPPoEHeader: React.FC<PPPoEHeaderProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const [isAddFormVisible, setAddFormVisible] = useState(false);

  const handleAddButtonClick = () => {
    setAddFormVisible(true);
  };

  const closeAddForm = () => {
    setAddFormVisible(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <>
      <div className="block items-center justify-between sm:flex">
        <div className="mb-4 flex items-center sm:mb-0">
          <form className="sm:pr-3" action="#" method="GET">
            <label htmlFor="PPPoE-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1 w-48 sm:w-64 xl:w-96">
              <input
                type="text"
                id="PPPoE-search"
                value={searchTerm}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-[#444444] bg-gray-50 p-2.5 text-dark outline-none focus:border-primary focus:bg-gray-200 active:border-primary dark:border-gray-600 dark:bg-dark-2 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary sm:text-sm"
                placeholder="Search for Client"
              />
            </div>
          </form>
        </div>
        <button
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-[#645de8e7] dark:bg-primary dark:text-white dark:hover:bg-[#645de8e7]"
          type="button"
          onClick={handleAddButtonClick}
        >
          Add New PPPoE
        </button>

        <AddPPPoE isVisible={isAddFormVisible} onClose={closeAddForm} />
      </div>
    </>
  );
};

export default PPPoEHeader;
