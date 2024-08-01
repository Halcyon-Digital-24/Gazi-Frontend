"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RxDashboard } from "react-icons/rx";
import { AiOutlineFilePpt, AiOutlineHeart } from "react-icons/ai";
import { LiaHandHoldingUsdSolid } from "react-icons/lia";
import { BsArrowRepeat } from "react-icons/bs";
import { BiMessageDetail } from "react-icons/bi";
import { RiPhoneCameraLine } from "react-icons/ri";
import { GrUserSettings } from "react-icons/gr";
import "./index.scss";
import { useAppSelector } from "@/redux/hooks";
import { API_ROOT } from "@/constant";

const ProfileSidebar = () => {
  const { login } = useAppSelector((state) => state.login);
  return (
    <div className=" md:col-span-3 shadow pb-6 absolute md:static  white-bg">
      <div className="relative profile-top">
        <div className="primary-bg h-28">
          <div className="shadow absolute bottom-0 left-[50%] rounded-full p-4 w-24 h-24 white-bg flex justify-center items-center translate-y-[50%] translate-x-[-50%] overflow-hidden">
            {login?.user?.image ? (
              <Image
                className="w-full"
                src={`${API_ROOT}/images/user/${login.user.image}`}
                width={80}
                height={80}
                alt="profile"
              />
            ) : (
              <Image
                className="w-full"
                src={"/assets/images/icon/profile.png"}
                width={80}
                height={80}
                alt="profile"
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-16 text-center ">
        <div className="text-center">
          <h3 className=" font-gotham font-medium text-base black-text text-center">
            {login?.user?.name}
          </h3>
          <p className=" font-gotham font-normal text-sm black-text secondary-bg mt-1 text-center">
            {login?.user?.email}
          </p>
        </div>
        <ul className="mt-12 text-left profile-link">
          <li className="flex items-center pl-3">
            <span className="mr-2">
              <RxDashboard />
            </span>
            <Link
              className="font-gotham font-normal text-sm black-text py-2"
              href={"/profile"}
            >
              Dashboard
            </Link>
          </li>
          <li className="flex items-center  pl-3 mt-1">
            <span className="mr-2">
              <AiOutlineFilePpt />
            </span>
            <Link
              className="font-gotham font-normal text-sm black-text py-2"
              href={"/profile/order"}
            >
              Purchase History
            </Link>
          </li>
          {/*  <li className="flex items-center pl-3">
            <span className="mr-2">
              <AiOutlineDownload />
            </span>
            <Link
              className="font-gotham font-normal text-sm black-text py-2"
              href={'/'}
            >
              Downloads
            </Link>
          </li> */}
          <li className="flex items-center  pl-3 mt-1">
            <span className="mr-2">
              <LiaHandHoldingUsdSolid />
            </span>
            <Link
              className="font-gotham font-normal text-sm black-text py-2"
              href={"/profile/refund"}
            >
              Refund Requested
            </Link>
          </li>
          <li className="flex items-center  pl-3">
            <span className="mr-2">
              <AiOutlineHeart />
            </span>
            <Link
              className="font-gotham font-normal text-sm black-text py-2"
              href={"/wishlist"}
            >
              Wishlist
            </Link>
          </li>
          <li className="flex items-center  pl-3 mt-1">
            <span className="mr-2">
              <BsArrowRepeat />
            </span>
            <Link
              className="font-gotham font-normal text-sm black-text py-2"
              href={"/compare"}
            >
              Compare
            </Link>
          </li>
          <li className="flex items-center  pl-3">
            <span className="mr-2">
              <BiMessageDetail />
            </span>
            <Link
              className="font-gotham font-normal text-sm black-text py-2"
              href={"/profile/questions"}
            >
              Questions
            </Link>
          </li>
          <li className="flex items-center pl-3 mt-1">
            <span className="mr-2">
              <RiPhoneCameraLine />
            </span>
            <Link
              className="font-gotham font-normal text-sm black-text py-2"
              href={"/profile/ticket"}
            >
              Support Ticket
            </Link>
          </li>
          <li className="flex items-center  pl-3">
            <span className="mr-2">
              <GrUserSettings />
            </span>
            <Link
              className="font-gotham font-normal text-sm black-text py-2"
              href={"/profile/manage-profile"}
            >
              Manage Profile
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSidebar;
