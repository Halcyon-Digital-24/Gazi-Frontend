"use client";
import Button from "@/components/button";
import FormGroup from "@/components/fromgroup";
import ProfileSidebar from "@/components/profile-sidebar";
import { useAppSelector } from "@/redux/hooks";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../utils/axiosInstance";
import "../../page.scss";

const ViewTicket = () => {
  const route = useRouter();
  const param = useParams();
  const [descError, setDescError] = useState("");
  const { login } = useAppSelector((state) => state.login);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [details, setDetails] = useState<string>("");
  const [image, setImage] = useState(undefined);

  const getTicketDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/customers/supports/${param?.slug}`,
        {
          headers: {
            Authorization: `Bearer ${login?.accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setMessages(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (login?.accessToken) {
      setIsLoggedIn(true);
    } else {
      route.push("/login");
    }
  }, [login, route]);

  useEffect(() => {
    if (login?.accessToken && param?.slug) {
      getTicketDetails();
    }
  }, [login, param?.slug]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!details.trim()) {
      setDescError("Replay message is required");
    }
    if (details?.trim() !== "" && login?.user?.id && param?.slug) {
      setDescError("");
      try {
        const formData = new FormData();
        formData.append("subject", "");
        formData.append("details", details?.trim());
        formData.append("user_id", login?.user?.id?.toString());
        formData.append("user_name", login?.user?.name);
        if (image) {
          formData.append("image", image);
        }
        formData.append("parent_text_id", param?.slug?.toString());
        formData.append("text_type", "query");
        formData.append("upload_preset", "w8omhp4w");
        const response = await axiosInstance.post(`/supports`, formData, {
          headers: {
            Authorization: `Bearer ${login?.accessToken}`,
          },
        });
        if (response?.status === 201) {
          setDetails("");
          setImage(undefined);
          getTicketDetails();
        }
      } catch (error) {
        console.log(error);
        toast.error("Reply Error!");
      }
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <section className="py-10">
          <div className="container">
            <div className="grid grid-cols-12 gap-6">
              <div className="sidebar  md:col-span-3  px-1">
                <span className="md:hidden">
                  <FaBars />
                </span>
                <div className="items">
                  <ProfileSidebar />
                </div>
              </div>
              <div className=" col-span-9">
                <div className="mb-12 h-[350px] overflow-y-scroll scrollbar">
                  {messages?.length > 0 ? (
                    messages?.map((message, index) =>
                      message.parent_text_id == 0 ||
                      message.user_id === login?.user?.id ? (
                        <div className="text-right py-2" key={index}>
                        <p className=" font-gotham text-sm primary-bg white-text inline-block px-2 py-1 rounded-md">
                          {message?.details}
                        </p>
                      </div>
                      ) : (
                         <div className="py-2" key={index}>
                          <p className=" font-gotham text-sm bg-hoverColor white-text inline-block px-2 py-1 rounded-md">
                            {message?.details}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <></>
                  )}
                </div>
                <form className="mx-auto" onSubmit={handleSubmit}>
                  <label
                    className=" font-gotham text-sm"
                    htmlFor="message"
                  ></label>
                  <textarea
                    id="message"
                    className="border secondary-border mt-3 w-full p-2 font-gotham text-xs outline-none min-h-[100px]"
                    placeholder="Your replay"
                    value={details}
                    onChange={(e: any) => setDetails(e.target.value)}
                  ></textarea>
                  {descError && (
                    <p className=" font-gotham text-[11px] warning">
                      {descError}
                    </p>
                  )}
                  <FormGroup
                    className="mt-2 "
                    type="file"
                    title="photo"
                    placeholder="Photo"
                    onChange={(e: any) => setImage(e.target.files[0])}
                  />
                  <div className="text-right">
                    <Button
                      type="submit"
                      className="mt-2 px-3 py-1 font-gotham text-xs"
                    >
                      Replay
                    </Button>
                  </div>
                </form>
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

export default ViewTicket;
