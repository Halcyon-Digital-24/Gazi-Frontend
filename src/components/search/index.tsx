"use client";
import React, { useState, ChangeEvent } from "react";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { GoSearch } from "react-icons/go";

const SearchArea = () => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const { replace } = useRouter();

  const [searchValue, setSearchValue] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value); // Update the search value in the state
  };

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(Object.fromEntries(searchParams));

    if (searchValue.trim()) {
      params.set("search", searchValue);
      replace(`/category/filter?${params}`);
    } else {
      params.delete("search");
      replace(`/category/filter?${params}`);
    }
  };

  return (
    <div className="relative">
      <form className="flex items-center justify-center mx-3">
        <input
          type="text"
          className="hidden md:block px-1 md:px-3 h-6 md:h-9 focus:outline-none border-l border-y md:border-0 lg:w-[450px] md:w-[300px] font-gotham font-normal text-sm placeholder:font-gotham md:placeholder:text-sm placeholder:text-xs"
          placeholder="Search for Products..."
          onChange={handleInputChange} // Handle input change
          value={searchValue} // Bind the input value to state
        />
        <button
          className="hidden md:block button primary-bg hover:bg-[#252022] h-6 md:h-9 px-2 md:px-6 font-gotham font-normal text-sm white-text"
          onClick={handleClick}
        >
          Search
        </button>

        {/* mobile search */}
        <input
          type="text"
          className="block md:hidden px-1 w-full h-6 focus:outline-none border border-r-0 border-[#cccccc] font-gotham font-normal text-xs placeholder:font-gotham placeholder:text-xs"
          placeholder="Search for Products..."
          onChange={handleInputChange} // Handle input change
          value={searchValue} // Bind the input value to state
        />
        <button
          className="block md:hidden border button h-6 md:h-9 px-2 md:px-6 font-gotham font-normal text-sm white-text"
          onClick={handleClick}
        >
          <GoSearch className="w-4 h-4"/>
        </button>
      </form>
    </div>
  );
};

export default SearchArea;
