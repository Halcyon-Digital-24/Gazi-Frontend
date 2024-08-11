"use client";
import { useAppSelector } from "@/redux/hooks";
import axiosInstance from "../../lib/axios";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormatPrice from "../price-formate";
import TextAreaGroup from "../textarea";
import Button from "../button";
type Inputs = {
  message: string;
};
const singleItem = ({ product, serial }: { product: any; serial: number }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const { login } = useAppSelector((state) => state.login);
  const [isOpen, setIsOpen] = useState(false);

  const handleRefunds = async (data: { message: string }) => {
    const { message } = data;
    const refundData = {
      customer_id: login?.user.id,
      order_id: product.order_id,
      product_id: product.product_id,
      product_name: product.product_name,
      product_price:
        product.discount_price > 0
          ? product.discount_price * 0.95
          : product.regular_price * 0.95,
      refund_status: "pending",
      message,
    };

    try {
      const response = await axiosInstance.post(`/refunds`, refundData, {
        headers: {
          Authorization: `Bearer ${login?.accessToken}`,
        },
      });
      if (response?.status === 201) {
        setValue("message", "");
        toast.success(response.data.message);
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <tr className="order-item">
      <td>{serial}</td>
      <td>{product.product_name}</td>
      <td>
        {/* Attribute */}
        {product.product_attribute
          ? <>
            {
              product.product_attribute.charAt(0) == '[' ?  //need to modify
                JSON.parse(product.product_attribute).map(
                  (v: any, i: number) => (
                    <span className="variant" key={i}>
                      {`${i ? "," : ""}${v.attribute_name}`}
                    </span>
                  )
                )
                : product.product_attribute
            }
          </>
          : "-"}
      </td>
      <td> {product.quantity}</td>
      <td>{FormatPrice(product.regular_price)}</td>
      <td> {FormatPrice(product.regular_price * product.quantity)}</td>
      <td className="px-6 py-4">
        {isOpen ? (
          <form onSubmit={handleSubmit(handleRefunds)} className="refund-area">
            <Controller
              name="message"
              control={control}
              rules={{
                required: "Message is required",
                pattern: {
                  value: /\S/,
                  message: "Enter valid message",
                },
              }}
              render={({ field }) => (
                <TextAreaGroup
                  title="Message *"
                  value={field.value}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    field.onChange(e.target.value)
                  }
                  required
                />
              )}
            />
            {errors.message && (
              <p className=" font-gotham text-xs warning">
                {errors.message.message}
              </p>
            )}
            <Button type="submit" className="px-3 py-1">
              Apply Now
            </Button>
          </form>
        ) : (
          <Button onClick={() => setIsOpen(true)} className="px-3 py-1">
            Apply Now
          </Button>
        )}
      </td>
    </tr>
  );
};

export default singleItem;
