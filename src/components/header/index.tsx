"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiSolidPhone } from "react-icons/bi";
import { AiFillBell } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import "./index.scss";
import { IHomePage } from "@/types/home";
import { IMenu } from "@/types/menu";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearLoginInfo } from "@/redux/features/login/loginSlice";
import { clearWishList } from "@/redux/features/wish-list/wishListSlice";
import Button from "../button";

type IProps = {
  homeData: IHomePage;
  menus: IMenu[];
};

const TopHeader = ({ homeData, menus }: IProps) => {
  const { login } = useAppSelector((state) => state.login);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (login?.accessToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [login?.accessToken]);

  useEffect(() => {
    // Check sessionStorage to see if the banner should be shown
    const bannerClosed = sessionStorage.getItem("bannerClosed");
    if (bannerClosed === "true") {
      setShowBanner(false);
    }
  }, []);

  const logoutHandler = (e: any) => {
    e.preventDefault();
    dispatch(clearWishList());
    dispatch(clearLoginInfo());
    router.push("/login");
  };

  const closeBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem("bannerClosed", "true");
  };

  return (
    <>
      {/* Ad Banner */}
      {showBanner && (
        <div className=" bg-gray-100 flex items-center justify-between py-2 pr-4 pl-3 z-50 shadow-lg md:hidden">
          <div className="flex items-center">
          <button
              className="text-gray-500 hover:text-gray-800 mr-2"
              onClick={closeBanner}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <img
              src="/assets/images/logo/GCart App Icon.png"
              alt="App Logo"
              className="w-10 h-10 mr-2"
            />
            <div>
              <p className="text-base font-bold font-gotham"><span className="secondary-text"><strong>G</strong></span>Cart</p>
              <p className="text-xs text-gray-500">FREE - In Google Play</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shadow">
            <Link
              href="/hello"
            >
             <Button className="px-4 py-1 rounded-sm">Install</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className={`container z-0  px-1 md:px-0 ${showBanner ? '' : ''}`}>
        <div className="flex justify-between items-center flex-wrap py-2">
          <div className="flex justify-between md:justify-start w-[100%] md:w-[auto] items-center">
            <div className="flex items-center">
              <span className="mr-2 primary-text font-gotham font-medium hover:text-[#E30513] text-sm">
                <BiSolidPhone />
              </span>
              <p className="primary-text font-gotham font-medium hover:text-[#E30513] text-[12px] sm:text-sm">
                {homeData?.mobile_number}
              </p>
            </div>
            <div className="flex items-center ml-4">
              <span className="mr-2 primary-text font-gotham font-medium hover:text-[#E30513] text-sm">
                <AiFillBell />
              </span>
              <p className="primary-text font-gotham font-medium hover:text-[#E30513] text-[12px] sm:text-sm">
                {homeData?.office_time}
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative group inline-block">
              <p className="sub-link cursor-pointer primary-text font-gotham font-medium hover:text-[#E30513] text-sm">
                Help
                <span>
                  <BsChevronDown className="inline text-[9px] font-bold ml-1" />
                </span>
              </p>
              <div className="absolute invisible group-hover:visible help-item sibling w-[130px] py-2 top-[23px] z-10 left-0">
                <ul className="bg-[#fff] font-gotham font-medium hover:text-[#E30513] text-[13px] black-text">
                  {menus?.map((menu, index) => (
                    <li
                      key={index}
                      className="px-2 py-1 hover:text-[#E30513]"
                    >
                      <Link href={menu.slug}>{menu.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {isLoggedIn ? (
              <span
                className="ml-6 sub-link primary-text font-gotham font-medium hover:text-[#E30513] text-sm logout-button"
                onClick={logoutHandler}
              >
                Logout
              </span>
            ) : (
              <>
                <Link
                  className="ml-6 sub-link primary-text font-gotham font-medium hover:text-[#E30513] text-sm"
                  href={"/login"}
                >
                  Login
                </Link>
                <Link
                  className="ml-6 sub-link primary-text font-gotham font-medium hover:text-[#E30513] text-sm"
                  href={"/register"}
                >
                  Registration
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopHeader;
