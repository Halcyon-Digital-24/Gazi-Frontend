"use client";
import "./index.scss";
import FormatPrice from "../price-formate";
import { useState, useEffect } from "react";
import { formatDate } from "../dateformate";

import SingleItem from "./singleItem";

const ProfileViewInvoice = ({
  order
}: any) => {
  const [orderDetails, setOrderDetails] = useState<any>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [amountBeforeCoupon, setAmountBeforeCoupon] = useState<number>(0);
  const advancePayment = orderDetails.advance_payment ?? 0;

  useEffect(() => {
    if (order?.coupon) {
      if (order?.coupon?.discount_type === "flat") {
        let tempDisCart = order?.orderItems;
        if (order?.coupon?.product_id) {
          let tempIdsArr: any[] = [];
          if (order?.coupon?.product_id?.split(",")?.length > 0) {
            tempIdsArr = order?.coupon?.product_id?.split(",");
          } else {
            tempIdsArr = [order?.coupon?.product_id];
          }
          tempDisCart = tempDisCart?.map((item: any) => {
            if (tempIdsArr.find((element) => element == item.product_id)) {
              return {
                ...item,
                discount_price:
                  item.regular_price - order?.coupon?.discount_amount,
              };
            }
            return item;
          });
        } else {
          tempDisCart = tempDisCart?.map((item: any) => {
            return {
              ...item,
              discount_price:
                item.regular_price - order?.coupon?.discount_amount,
            };
          });
        }
        setOrderDetails(tempDisCart);


        if (order?.coupon) {
          let finalPrice = 0;
          tempDisCart?.map((item: any) => {
            if (order?.coupon?.product_id) {
              finalPrice += item?.discount_price * item?.quantity;
            } else {
              finalPrice += item?.regular_price * item?.quantity;
            }
          });
          if (!order?.coupon?.product_id) {
            finalPrice = finalPrice - order?.coupon?.discount_amount
          }
          console.log("final - ", finalPrice);
          setTotalPrice(finalPrice);
        }
        console.log(tempDisCart);

      } else {
        let tempDisCart = order?.orderItems;
        if (order?.coupon?.product_id) {
          let tempIdsArr: any[] = [];
          if (order?.coupon?.product_id?.split(",")?.length > 0) {
            tempIdsArr = order?.coupon?.product_id?.split(",");
          } else {
            tempIdsArr = [order?.coupon?.product_id];
          }
          tempDisCart = tempDisCart?.map((item: any) => {
            if (tempIdsArr.find((element) => element == item.product_id)) {
              return {
                ...item,
                discount_price:
                  item.regular_price -
                  item.regular_price * (order?.coupon.discount_amount / 100),
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
                item.regular_price * (order?.coupon.discount_amount / 100),
            };
          });
        }
        setOrderDetails(tempDisCart);

        if (order?.coupon) {
          let finalPrice = 0;
          tempDisCart?.map((item: any) => {
            if (order?.coupon?.product_id) {
              finalPrice += item?.discount_price * item?.quantity;
            } else {
              finalPrice += item?.regular_price * item?.quantity;
            }
          });

          if (!order?.coupon?.product_id) {
            finalPrice = finalPrice - (finalPrice * (order?.coupon?.discount_amount / 100));
          }
          console.log("final - ", finalPrice);
          setTotalPrice(finalPrice);
        }
        console.log(tempDisCart);

      }
    }
  }, [order]);

  useEffect(() => {
    if (order?.orderItems?.length > 0) {
      let totalRegularPrice = 0;

      order?.orderItems?.forEach((item: any) => {
        totalRegularPrice += item?.regular_price * item?.quantity;
      });
      console.log(totalRegularPrice);

      setAmountBeforeCoupon(totalRegularPrice);
    }
    if (!order.coupon) {
      let finalPrice = 0;
      orderDetails?.orderItems?.map((item: any) => {
        finalPrice += (item?.discount_price
          ? item?.discount_price
          : item?.regular_price) * item?.quantity;
      });
      setTotalPrice(finalPrice);
    }
  }, [[orderDetails?.coupon, orderDetails?.orderItems, order, order?.coupon]]);

  console.log(amountBeforeCoupon);

  return (
    <div className="profile-invoice white-bg md:p-[40px] md:pt-0 p-1">
      <div className="invoice-header font-gotham text-xs">
        <div className="title">
          {
            order?.order_form == "web" || order.order_prefix === "GCW" ?
              <>
                <img src="/assets/invoice/web-header.png" alt="invoice" />
              </> : <>
                {order.order_prefix === "GHA" ? (
                  <img src="/assets/invoice/homeappliance.png" alt="invoice" />
                ) : (
                  <img src="/assets/invoice/pump.png" alt="invoice" />
                )}
              </>
          }
        </div>
        <h4 className="customer-details font-gotham font-medium">
          Customer Details
        </h4>
        <div className="details">
          <div className="left">
            <p>
              <span className="invoice-title">Invoice:</span>{" "}
              {order.order_prefix}-{order.id}
            </p>
            <p>
              {" "}
              <span className="invoice-title">Name: </span> {order.name}
            </p>
            <p>
              <span className="invoice-title">Email: </span> {order.email}
            </p>
            <p>
              <span className="invoice-title">Phone: </span>{" "}
              {`+88${order.mobile}`}{" "}
            </p>
            <p dir="auto" className="bangla-font">
               Address:
              {order.address}{" "}
              {order.city ? `, ${order.city}` : ""}{" "}
              {order.thana ? `, ${order.thana}` : ""}
            </p>

          </div>
          <div className="order-details right">
            <p>
              <span className="invoice-title">Order Date: </span>{" "}
              {formatDate(order.created_at)}
            </p>
            <p>
              <span className="invoice-title"> Order Status:</span>{" "}
              {order?.order_status}
            </p>
            <p>
              <span className="invoice-title"> Total Order Amount : </span>{" "}
              {FormatPrice(totalPrice + order.delivery_fee - order.custom_discount)}
            </p>
            {/* <p>
              <span className="invoice-title"> Shipping Method: </span>{" "}
              {order?.delivery_method === "homeDelivery"
                ? "Free Delivery"
                : "Express Delivery"}
            </p> */}
            <p>
              <span className="invoice-title"> Payment Method: </span>{" "}
              {order?.payment_method === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </p>
            <p>
              <span className="invoice-title"> Payment Status: </span>{" "}
              {order?.payment_status}
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-scroll md:overflow-x-visible md:col-span-9 col-span-12">
        <table className="invoice-details-table">
          <tr className="table-heading">
            <th>SL.</th>
            <th>Description</th>
            <th>Attribute</th>
            <th>Qty</th>
            <th>Unit price (BDT)</th>
            <th>Total</th>
            <th>Refund Request</th>
          </tr>
          {order?.orderItems?.length > 0 &&
            order?.orderItems?.map((product: any, index: any) => (
              <SingleItem product={product} key={index} serial={index + 1} />
            ))}
          <tr>
            <td className="span-item" colSpan={4}></td>
            <td className="heading-title">Sub Total</td>
            <td>{FormatPrice(amountBeforeCoupon)}</td>
          </tr>
          <tr>
            <td className="span-item" colSpan={4}></td>
            <td className="heading-title">Delivery</td>
            <td>{FormatPrice(order.delivery_fee)}</td>
          </tr>
          <tr>
            <td className="span-item" colSpan={4}></td>
            <td className="heading-title">Discount</td>
            <td>{FormatPrice(amountBeforeCoupon - totalPrice + order.custom_discount)}</td>
          </tr>
          <tr>
            <td className="span-item" colSpan={4}></td>
            <td className="heading-title">Advance</td>
            <td>{FormatPrice(order.advance_payment ?? 0)}</td>
          </tr>
          <tr>
            <td className="span-item" colSpan={4}></td>
            <td className="heading-title">Due Amount</td>
            <td>{FormatPrice(totalPrice + order.delivery_fee - order.custom_discount - advancePayment)}</td>
          </tr>

        </table>
      </div>
      <div className="notes mt-3">
        <h3 className=" font-gotham font-medium text-sm">Notes:</h3>

        {
          order?.order_form == "web" || order.order_prefix === "GC" ?
            <>
              <p className=" font-gotham text-xs font-light">
                1. Please ensure to check for any physical damage to the product upon
                receiving it. After receiving the product, no claims for physical
                damage will be accepted.
              </p>
            </> : <>
              {order.order_prefix === "GHA" ? (
                <> <p className=" font-gotham text-xs font-light">
                  1. All our products come with a{" "}
                  {order.order_prefix === "GHA" ? "one-year" : "two-years"} service
                  warranty. To claim the warranty, please present this invoice.
                </p>
                  <p className=" font-gotham text-xs font-light">
                    2. Please ensure to check for any physical damage to the product upon
                    receiving it. After receiving the product, no claims for physical
                    damage will be accepted.
                  </p>
                  <p className=" font-gotham text-xs font-light">
                    3. For official installation, please inform us upon receiving the
                    product if the customer wishes for us to install it. We will require
                    24 hours to complete the installation.
                  </p> </>
              ) : (
                <><p className=" font-gotham text-xs font-light">
                  1. All our products come with a{" "}
                  {order.order_prefix === "GHA" ? "one-year" : "two-years"} service
                  warranty. To claim the warranty, please present this invoice.
                </p>
                  <p className=" font-gotham text-xs font-light">
                    2. Please ensure to check for any physical damage to the product upon
                    receiving it. After receiving the product, no claims for physical
                    damage will be accepted.
                  </p></>
              )}
            </>
        }

      </div>
      <div className="invoice-footer">
        <div className="title">
          {
            order?.order_form == "web" || order.order_prefix === "GCW" ?
              <>
                <img src="/assets/invoice/web-footer.jpg" alt="invoice" />
              </> : <>
                {order.order_prefix === "GHA" ? (
                  <img src="/assets/invoice/home-footer.png" alt="invoice" />
                ) : (
                  <img src="/assets/invoice/pump-footer.png" alt="invoice" />
                )}
              </>
          }
        </div>
      </div>

    </div>
  );
};

export default ProfileViewInvoice;
