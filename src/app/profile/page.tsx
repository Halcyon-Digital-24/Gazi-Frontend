"use client";
import React, { useEffect, useState } from "react";
import "./page.scss";
import Image from "next/image";
// import { RxDashboard } from "react-icons/rx";
import { AiOutlineFilePpt, AiOutlineHeart } from "react-icons/ai";
import { LiaHandHoldingUsdSolid } from "react-icons/lia";
import { BsArrowRepeat } from "react-icons/bs";
import { BiMessageDetail } from "react-icons/bi";
import { RiPhoneCameraLine } from "react-icons/ri";
import { API_ROOT } from "@/constant";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
// import { CiMenuFries } from 'react-icons/ci';
import axiosInstance from "../../../utils/axiosInstance";
import { clearWishList } from "@/redux/features/wish-list/wishListSlice";
import { clearLoginInfo } from "@/redux/features/login/loginSlice";
import { PiArrowFatLinesLeftFill } from "react-icons/pi";
import Link from "next/link";
import { GrUserSettings } from "react-icons/gr";
import ProfileSidebar from "@/components/profile-sidebar";


const Profile = () => {
  const route = useRouter();
  const { login } = useAppSelector((state) => state.login);
  const { cart } = useAppSelector((state) => state.cart);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<any>();

  const getDashboardInfo = async () => {
    const response = await axiosInstance.get(`/customers/dashboards`, {
      headers: {
        Authorization: `Bearer ${login?.accessToken}`,
      },
    });
    if (response?.status === 200) {
      setDashboard(response?.data);
    }
  };

  useEffect(() => {
    if (login?.accessToken) {
      setIsLoggedIn(true);
      getDashboardInfo();
    } else {
      route.push("/login");
    }
  }, [login, route]);

  const [isMounted, setIsMounted] = useState(false); 

  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsMounted(true);  
  }, []);

  useEffect(() => {
    if (login?.accessToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [login?.accessToken]);

  const logoutHandler = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(clearWishList());
    dispatch(clearLoginInfo());
    if (isMounted) {
      const router = require("next/router").useRouter();  
      router.push("/login");
    }
  };

  if (!isMounted) {
    return null; 
  }

  return (
    <>
      {isLoggedIn ? (
        <section className="">
          {/* for desktop  */}
          <div className="md:block hidden profile">
            <div className="container">
              <div className="flex md:flex-none md:grid md:grid-cols-12 md:gap-6">
                <div className="sidebar  md:col-span-3  px-2">
                 
                  <div className="">
                  <ProfileSidebar/>
                  </div>
                </div>
                <div className="flex-1 md:col-span-9 col-span-12 pr-1 ">
                  <div className="grid grid-cols-3 md:gap-4 gap-1">
                    <div className=" primary-bg md:py-5 p-2 md:pl-5">
                      <h2 className=" font-medium font-gotham text-sm md:text-base white-text">
                        {cart?.length} Products
                      </h2>
                      <p className=" font-gotham font-light text-xs white-text">
                        In Your Cart
                      </p>
                    </div>
                    <div className=" primary-bg md:py-5 p-2 md:pl-5">
                      <h2 className=" font-medium font-gotham text-sm md:text-base white-text">
                        {dashboard?.wishlistCount} Products
                      </h2>
                      <p className=" font-gotham font-light text-xs white-text">
                        In Your Wishlist
                      </p>
                    </div>
                    <div className=" primary-bg md:py-5 p-2 md:pl-5">
                      <h2 className=" font-medium font-gotham text-sm md:text-base white-text">
                        {dashboard?.orderCount} Products
                      </h2>
                      <p className=" font-gotham font-light text-xs white-text">
                        In Your Ordered
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* for mobile  */}
          <div className="md:hidden">
            <div className="md:col-span-3 shadow pb-6  md:static white-bg ">
              <div className="relative profile-top">
                <div className="primary-bg h-28">
                  <div className="shadow absolute bottom-0 left-[50%] rounded-full p-4 w-24 h-24 white-bg flex justify-center items-center translate-y-[50%] translate-x-[-50%] overflow-hidden">
                    {login?.user?.image ? (
                      <Image
                        className="w-full"
                        src={`${API_ROOT}/images/user/${login.user.image}`}
                        width={80}
                        height={80}
                        style={{ width: "100%", height: "auto" }}
                        alt="profile"
                      />
                    ) : (
                      <Image
                        className="w-full"
                        src={"/assets/images/icon/profile.png"}
                        width={80}
                        height={80}
                        style={{ width: "100%", height: "auto" }}
                        alt="profile"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-16 text-center">
                <div className="text-center">
                  <h3 className="font-gotham font-medium text-base black-text text-center">
                    {login?.user?.name}
                  </h3>
                  <p className="font-gotham font-normal text-sm black-text secondary-bg mt-1 text-center">
                    {login?.user?.email}
                  </p>
                </div>
                <ul className="mt-12 text-left profile-link">
                  {/* <li className="flex items-center pl-3">
                    <span className="mr-2">
                      <RxDashboard />
                    </span>
                    <Link className="font-gotham font-normal text-sm black-text py-2" href="/profile">
                      Dashboard
                    </Link>
                  </li> */}
                  <li className="flex items-center pl-3 mt-1">
                    <span className="mr-2">
                      <AiOutlineFilePpt />
                    </span>
                    <Link className="font-gotham font-normal text-sm black-text py-2" href="/profile/order">
                      Purchase History
                    </Link>
                  </li>
                  <li className="flex items-center pl-3 mt-1">
                    <span className="mr-2">
                      <LiaHandHoldingUsdSolid />
                    </span>
                    <Link className="font-gotham font-normal text-sm black-text py-2 pr-2" href="/profile/refund">
                      Refund Requested
                    </Link>
                  </li>
                  <li className="flex items-center pl-3">
                    <span className="mr-2">
                      <AiOutlineHeart />
                    </span>
                    <Link className="font-gotham font-normal text-sm black-text py-2" href="/wishlist">
                      Wishlist
                    </Link>
                  </li>
                  <li className="flex items-center pl-3 mt-1">
                    <span className="mr-2">
                      <BsArrowRepeat />
                    </span>
                    <Link className="font-gotham font-normal text-sm black-text py-2" href="/compare">
                      Compare
                    </Link>
                  </li>
                  <li className="flex items-center pl-3">
                    <span className="mr-2">
                      <BiMessageDetail />
                    </span>
                    <Link className="font-gotham font-normal text-sm black-text py-2" href="/profile/questions">
                      Questions
                    </Link>
                  </li>
                  <li className="flex items-center pl-3 mt-1">
                    <span className="mr-2">
                      <RiPhoneCameraLine />
                    </span>
                    <Link className="font-gotham font-normal text-sm black-text py-2" href="/profile/ticket">
                      Support Ticket
                    </Link>
                  </li>
                  <li className="flex items-center pl-3">
                    <span className="mr-2">
                      <GrUserSettings />
                    </span>
                    <Link className="font-gotham font-normal text-sm black-text py-2" href="/profile/manage-profile">
                      Manage Profile
                    </Link>
                  </li>
                  {isLoggedIn ? (
                    <li className="flex items-center pl-3">
                      <span className="mr-2">
                        <PiArrowFatLinesLeftFill />
                      </span>
                      <span
                        className="py-2 sub-link primary-text font-gotham font-medium hover:text-[#E30513] text-sm logout-button"
                        onClick={logoutHandler}
                      >
                        Logout
                      </span>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>

        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default Profile;
