"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RxDashboard } from "react-icons/rx";
import { AiOutlineFilePpt, AiOutlineHeart } from "react-icons/ai";
import { LiaHandHoldingUsdSolid } from "react-icons/lia";
import { BsArrowRepeat } from "react-icons/bs";
import { BiMessageDetail } from "react-icons/bi";
import { RiPhoneCameraLine } from "react-icons/ri";
import { GrUserSettings } from "react-icons/gr";
import { PiArrowFatLinesLeftFill } from "react-icons/pi";
import "./index.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { API_ROOT } from "@/constant";
import { clearWishList } from "@/redux/features/wish-list/wishListSlice";
import { clearLoginInfo } from "@/redux/features/login/loginSlice";
import dynamic from 'next/dynamic';

const ProfileSidebar = () => {
  const { login } = useAppSelector((state) => state.login);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false); // Track whether the component is mounted

  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsMounted(true);  // Set the component as mounted after first render
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
      const router = require("next/router").useRouter();  // Use require to load useRouter dynamically
      router.push("/login");
    }
  };

  if (!isMounted) {
    return null; // Prevent rendering on the server or until the component is mounted
  }

  return (
    <div className="md:col-span-3 shadow pb-6 absolute md:static white-bg z-10">
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
          <li className="flex items-center pl-3">
            <span className="mr-2">
              <RxDashboard />
            </span>
            <Link className="font-gotham font-normal text-sm black-text py-2" href="/profile">
              Dashboard
            </Link>
          </li>
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
  );
};

export default ProfileSidebar;
