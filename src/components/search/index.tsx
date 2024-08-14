"use client";
import React, { useState, ChangeEvent } from "react";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

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
          className="block md:hidden px-1 w-full h-6 focus:outline-none border-l border-y font-gotham font-normal text-xs placeholder:font-gotham placeholder:text-xs"
          placeholder="Search for Products..."
          onChange={handleInputChange} // Handle input change
          value={searchValue} // Bind the input value to state
        />
        <button
          className="block md:hidden border button h-6 md:h-9 px-2 md:px-6 font-gotham font-normal text-sm white-text"
          onClick={handleClick}
        >
          <svg
            fill="#FFFFFF"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="24px"
            height="18px"
          >
            <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchArea;
