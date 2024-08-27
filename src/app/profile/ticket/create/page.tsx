"use client";
import Button from "@/components/button";
import FormGroup from "@/components/fromgroup";
import ProfileSidebar from "@/components/profile-sidebar";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../utils/axiosInstance";
import { CiMenuFries } from 'react-icons/ci';

const CreateTicket = () => {
  const route = useRouter();
  const { login } = useAppSelector((state) => state.login);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [subject, setSubject] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (login?.accessToken) {
      setIsLoggedIn(true);
    } else {
      route.push("/login");
    }
  }, [login, route]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (subject && details && login?.user?.id) {
      try {
        const formData = new FormData();

        formData.append("subject", subject);
        formData.append("user_name", login?.user?.name);
        formData.append("details", details);
        formData.append("user_id", login?.user?.id?.toString());
        if (image) {
          formData.append("image", image);
        }
        formData.append("parent_text_id", "0");
        formData.append("text_type", "query");
        formData.append("upload_preset", "w8omhp4w");

        const response = await axiosInstance.post(`/supports`, formData, {
          headers: {
            Authorization: `Bearer ${login?.accessToken}`,
          },
        });
        if (response?.status === 201) {
          toast.success("Ticket Created Successfuly!");
          route.push("/profile/ticket");
        }
      } catch (error) {
        console.log(error);
        toast.error("Ticket Create Error!");
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
                  <CiMenuFries  />
                </span>
                <div className=" items">
                  <ProfileSidebar />
                </div>
              </div>
              <div className="col-span-10 md:col-span-9">
                <form
                  className="w-auto md:w-[480px] mx-auto shadow px-4 md:px-8 py-3 md:py-10"
                  onSubmit={handleSubmit}
                >
                  <FormGroup
                    className="mt-2 "
                    type="text"
                    title="Subject*"
                    placeholder="subject"
                    required
                    onChange={(e: any) =>
                      e.target.value.trim() === ""
                        ? setSubject(null)
                        : setSubject(e.target.value.trim())
                    }
                  />
                  <textarea
                    className="border secondary-border mt-3 w-full p-2 font-gotham text-xs outline-none min-h-[100px]"
                    placeholder="Your replay"
                    onChange={(e: any) =>
                      e.target.value.trim() === ""
                        ? setDetails(null)
                        : setDetails(e.target.value.trim())
                    }
                  ></textarea>
                  <FormGroup
                    className="mt-2 "
                    type="file"
                    title="Photo"
                    placeholder="Photo"
                    onChange={(e: any) =>
                      e.target.files[0]
                        ? setImage(e.target.files[0])
                        : setImage(null)
                    }
                  />
                  <Button className="mt-2 px-3 py-1 font-gotham text-xs">
                    Submit
                  </Button>
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

export default CreateTicket;
