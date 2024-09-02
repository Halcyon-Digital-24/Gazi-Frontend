"use client";
import { API_URL } from "@/constant";
import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";
import { LiaDownloadSolid, LiaEye } from "react-icons/lia";
import { RxCross2 } from "react-icons/rx";
import ReactToPrint from "react-to-print";
import { formatDate } from "../dateformate";
import Invoice from "../invoice";
import SingleOrderDetails from "../orderDetails";
import "./index.scss";
import FormatPrice from "../price-formate";
import ProfileViewInvoice from "../profile-view-invoice";

export interface IProps {
  order: any;
}

const SingleOrder: FC<IProps> = ({ order }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { login } = useAppSelector((state) => state.login);
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>({});
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [amountBeforeCoupon, setAmountBeforeCoupon] = useState<number>(0);
  const advancePayment = orderDetails.advance_payment ?? 0;
  
  useEffect(() => {
    if (order?.id) {
      const getOrderDetails = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/customers/orders/${order?.id}`,
            {
              headers: {
                Authorization: `Bearer ${login?.accessToken}`,
              },
            }
          );
          if (response?.status === 200) {
            setOrderDetails(response?.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getOrderDetails();
    }
  }, [order?.id]);

  useEffect(() => {
    if (orderDetails?.coupon) {
      if (orderDetails?.coupon?.discount_type === "flat") {
        let tempDisCart = orderDetails?.orderItems;
        if (orderDetails?.coupon?.product_id) {
          let tempIdsArr: any[] = [];
          if (orderDetails?.coupon?.product_id?.split(",")?.length > 0) {
            tempIdsArr = orderDetails?.coupon?.product_id?.split(",");
          } else {
            tempIdsArr = [orderDetails?.coupon?.product_id];
          }
          tempDisCart = tempDisCart?.map((item: any) => {
            if (tempIdsArr.find((element) => element == item.product_id)) {
              return {
                ...item,
                discount_price:
                  item.regular_price - orderDetails?.coupon?.discount_amount,
              };
            }
            return item;
          });
        } else {
          tempDisCart = tempDisCart?.map((item: any) => {
            return {
              ...item,
              discount_price:
                item.regular_price - orderDetails?.coupon?.discount_amount,
            };
          });
        }
        setOrderDetails((prevState: any) => {
          return {
            ...prevState,
            orderItems: tempDisCart,
          };
        });
      } else {
        let tempDisCart = orderDetails?.orderItems;
        if (orderDetails?.coupon?.product_id) {
          let tempIdsArr: any[] = [];
          if (orderDetails?.coupon?.product_id?.split(",")?.length > 0) {
            tempIdsArr = orderDetails?.coupon?.product_id?.split(",");
          } else {
            tempIdsArr = [orderDetails?.coupon?.product_id];
          }
          tempDisCart = tempDisCart?.map((item: any) => {
            if (tempIdsArr.find((element) => element == item.product_id)) {
              return {
                ...item,
                discount_price:
                  item.regular_price -
                  item.regular_price *
                  (orderDetails?.coupon.discount_amount / 100),
              };
            }
            return item;
          });
        } else {
          tempDisCart = tempDisCart?.map((item: any) => {
            return {
              ...item,
              discount_price:
                item.regular_price -
                item.regular_price *
                (orderDetails?.coupon.discount_amount / 100),
            };
          });
        }
        setOrderDetails((prevState: any) => {
          return {
            ...prevState,
            orderItems: tempDisCart,
          };
        });
      }
    }
  }, [orderDetails?.coupon]);

  useEffect(() => {
    if (orderDetails?.orderItems?.length > 0) {
      if (orderDetails?.coupon) {
        let finalPrice = 0;
        orderDetails?.orderItems?.map((item: any) => {
          finalPrice += item?.discount_price * item?.quantity;
        });
        setFinalPrice(finalPrice);
      } else {
        let finalPrice = 0;
        orderDetails?.orderItems?.map((item: any) => {
          finalPrice += (item?.discount_price
            ? item?.discount_price
            : item?.regular_price) * item?.quantity;
        });
        setFinalPrice(finalPrice);
      }
    }

    if (orderDetails?.orderItems?.length > 0) {
      let amountBeforeCoupon = 0;
      orderDetails?.orderItems?.forEach((item: any) => {
        amountBeforeCoupon += item?.regular_price * item?.quantity;
      });
      setAmountBeforeCoupon(amountBeforeCoupon);
    }
  }, [orderDetails?.coupon, orderDetails?.orderItems]);
  return (
    <tr className=" font-normal font-gotham text-sm table-border">
      <td scope="row" className="px-2 md:px-6 py-1 md:py-4 whitespace-nowrap overflow-hidden text-ellipsis">
        {order?.order_prefix}-{order.id}
      </td>
      <td className="px-2 md:px-6 py-1 md:py-4 whitespace-nowrap overflow-hidden text-ellipsis">
        {formatDate(order?.created_at)}
      </td>
      <td className="px-2 md:px-6 py-1 md:py-4 whitespace-nowrap overflow-hidden text-ellipsis">
        ৳{(finalPrice + Number(order.delivery_fee)) - (Number(order.advance_payment) + Number(order.custom_discount))}
      </td>
      <td className="px-2 md:px-6 py-1 md:py-4 capitalize whitespace-nowrap overflow-hidden text-ellipsis">
        {order?.order_status}
      </td>
      <td className="px-2 md:px-6 py-1 md:py-4 capitalize whitespace-nowrap overflow-hidden text-ellipsis">
        {order?.payment_status}
      </td>
      <td className="px-6 py-2">
        <div className="flex justify-center info-icons">
          <div onClick={() => setIsOpen(true)}>
            <LiaEye className="mr-1 cursor-pointer" />
          </div>
          <ReactToPrint
            trigger={() => <LiaDownloadSolid className="cursor-pointer" />}
            content={() => componentRef.current}
          />

          <div className="print-area" ref={componentRef}>
            {
              <Invoice
                order={order}
                amountBeforeCoupon={amountBeforeCoupon}
                shipingCost={order.delivery_fee}
                finalPrice={finalPrice}
              />
            }
          </div>

          {/* Order Popup View */}
          {isOpen && (
            <div className="refund-request shadow-lg mb-4">
              <div className="flex justify-end">
                <span
                  className=" cursor-pointer ml-auto"
                  onClick={() => setIsOpen(false)}
                >
                  <RxCross2 />
                </span>
              </div>
              <ProfileViewInvoice
                order={order}
                amountBeforeCoupon={amountBeforeCoupon}
                shipingCost={order.delivery_fee}
                finalPrice={finalPrice}
              />
            </div>
          )}
        </div>
      </td>

    </tr>
  );
};

export default SingleOrder;
