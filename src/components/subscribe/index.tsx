"use client";
import { API_URL } from "@/constant";
import axios from "axios";
import React from "react";
import { PiEnvelopeThin } from "react-icons/pi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
type Inputs = {
  email: string;
};

const Subscriber = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const handleSubscribe = async (data: any) => {
    try {
      const response = await axios.post(`${API_URL}/subscribes`, data);
      if (response?.status === 201) {
        toast.success("Subscribed Successfully!");
        setValue("email", "");
      }
    } catch (error) {
      console.log(error);
      toast.error("Subscribtion Error!");
    }
  };

  return (
    <div className="flex items-end">
      <form
        className="relative inline-block subscribe-form"
        onSubmit={handleSubmit(handleSubscribe)}
      >
        <input
          type="email"
          className="px-3 py-2 border-b-2  focus:ring-0 focus:border-blue-500 outline-none placeholder:font-gotham  placeholder:font-light placeholder:text-sm"
          {...register("email", {
            required: "Email Address is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Invalid email address",
            },
          })}
          placeholder="Enter your email..."
        />

        <button type="submit" aria-label="Submit">
          <span className=" absolute top-[50%] translate-y-[-50%] right-0">
            <PiEnvelopeThin className="subscribe-icon w-5 h-5" />
          </span>
        </button>
        {errors.email && (
          <p className=" font-gotham text-xs warning">{errors.email.message}</p>
        )}
      </form>
    </div>
  );
};

export default Subscriber;
