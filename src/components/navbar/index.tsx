"use client";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineHeart } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { BsArrowRepeat } from "react-icons/bs";
import { HiOutlineShoppingBag } from "react-icons/hi";
import "./index.scss";

import { useAppSelector } from "@/redux/hooks";
import SearchArea from "../search";
import { API_ROOT } from "@/constant";
import { useEffect, useState } from "react";

const Navbar = ({ logo }: { logo: string }) => {
  const { cart } = useAppSelector((state) => state.cart);
  const { wishList } = useAppSelector((state) => state.wishList);
  const { data: compareItems } = useAppSelector((state) => state.compare);

  const [stickyClass, setStickyClass] =useState('')

  function stickNavbar() {
    let windowHeight = window.scrollY;
    windowHeight >= 10 ?setStickyClass("sticky-nav"): setStickyClass("")
}

useEffect(() => {
    window.addEventListener("scroll", stickNavbar);
    return () => {
      window.removeEventListener('scroll', stickNavbar);
    }
}, []);
  return (
    <nav className={stickyClass}>
      <div className="navbar shadow">
        <div className="container px-2 md:px-0">
          <div className=" flex justify-between items-center md:py-5 py-3">
            <div className=" w-[33%]">
              <Link href={"/"} className="inline-block">
                <Image
                  className="logo"
                  src={`${API_ROOT}/images/setting/${logo}`}
                  // src={"/assets/images/logo/Logo.png"}
                  width={200}
                  height={80}
                  quality={100}
                  alt="logo"
                />
              </Link>
            </div>
            <SearchArea />
            <div className="w-[33%]">
              <div className="flex flex-row-reverse">
                <Link className="link-item" href={"/profile"}>
                  <div className=" link relative md:ml-6 ml-3">
                    <BiUserCircle className=" text-2xl primary-text" />
                  </div>
                </Link>
                <Link className="link-item" href={"/wishlist"}>
                  <div className="link relative md:ml-6 ml-3">
                    <AiOutlineHeart className=" text-2xl primary-text" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full font-poppins font-normal text-xs white-text absolute-item translate-x-2/4 flex justify-center items-center">
                      {wishList.length}
                    </div>
                  </div>
                </Link>
                <Link className="link-item" href={"/cart"}>
                  <div className="link relative md:ml-6 ml-3">
                    <HiOutlineShoppingBag className=" text-2xl primary-text" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full font-poppins font-normal text-xs white-text absolute-item translate-x-2/4 flex justify-center items-center">
                      {cart.length}
                    </div>
                  </div>
                </Link>
                <Link className="link-item" href={"/compare"}>
                  <div className="link relative md:ml-6 ml-3">
                    <BsArrowRepeat className=" text-2xl primary-text" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full font-poppins font-normal text-xs white-text absolute-item translate-x-2/4 flex justify-center items-center">
                      {compareItems.length}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
