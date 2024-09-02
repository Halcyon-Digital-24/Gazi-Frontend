"use client";
import React, { useEffect, useState } from "react";
import "./page.scss";
import ProfileSidebar from "@/components/profile-sidebar";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { CiMenuFries } from 'react-icons/ci';
import axiosInstance from "../../../utils/axiosInstance";

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

  return (
    <>
      {isLoggedIn ? (
        <section className="profile">
          <div className="container">
            <div className="flex md:flex-none md:grid md:grid-cols-12 md:gap-6">
              <div className="sidebar  md:col-span-3  px-2">
                <span className="md:hidden">
                  <CiMenuFries  />
                </span>
                <div className=" items">
                  <ProfileSidebar />
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
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default Profile;
