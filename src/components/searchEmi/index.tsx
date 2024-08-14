"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import "./index.scss";
import Button from "../button";

const SearchEmi = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bankName, setBankName] = useState("");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim() === "") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const queryString = createQueryString("bank_name", bankName);
    router.push(`?${queryString}`);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBankName(event.target.value);
  };

  return (
    <div className="emi-wrapper">
      <form className="emi-form" onSubmit={handleSearch}>
        <input
          className=" px-2 py-1 focus:outline-0 text-sm placeholder:font-gotham"
          type="text"
          placeholder="Search bank here..."
          onChange={handleChange}
        />
        <Button type="submit" className=" px-2 py-1 font-gotham text-sm">
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchEmi;
