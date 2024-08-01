"use client";
import "./index.scss";
import FormatPrice from "../price-formate";
import { useState, useEffect } from "react";
import { formatDate } from "../dateformate";

const Invoice = ({
  order,
  amountBeforeCoupon,
  shipingCost,
  finalPrice,
}: any) => {
  const [totalPrice, setTotalPrice] = useState(0);
  // const [hasData,setHasData] = useState<boolean>
  const [orderItems, setOrderItems] = useState<any[]>(
    order?.orderItems?.length > 0 ? order?.orderItems : []
  );
  const advancePayment = order.advance_payment ?? 0;
  // const [amountBeforeCoupon, setAmountBeforeCoupon] = useState<number>(0);

  useEffect(() => {
    if (orderItems?.length > 0) {
      let totalRegularPrice = 0;

      orderItems?.forEach((item: any) => {
        totalRegularPrice += item?.regular_price * item?.quantity;
      });

      // setAmountBeforeCoupon(totalRegularPrice);

      if (order?.coupon) {
        let finalPrice = 0;
        orderItems?.map((item: any) => {
          finalPrice += item?.discount_price * item?.quantity;
        });
        setTotalPrice(finalPrice);
      } else {
        let finalPrice = 0;
        orderItems?.map((item: any) => {
          finalPrice += (item?.discount_price
            ? item?.discount_price
            : item?.regular_price) * item?.quantity;
        });
        setTotalPrice(finalPrice);
      }
    }
  }, [order, orderItems]);


  return (
    <div className="invoice white-bg hidden">
      <div className="invoice-body">
        <div className="invoice-header font-gotham text-xs" >
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
              <p>
                <span className="invoice-title"> Address: </span> {order.address}{" "}
                {order.city ? `, ${order.city}` : ""}{" "}
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
              <p>
                <span className="invoice-title"> Shipping Method: </span>{" "}
                {order?.delivery_method === "homeDelivery"
                  ? "Free Delivery"
                  : "Express Delivery"}
              </p>
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

        <table className="invoice-details-table" >
          <tr className="table-heading">
            <th>SL.</th>
            <th>Description</th>
            <th>Attribute</th>
            <th>Qty</th>
            <th>Unit price (BDT)</th>
            <th>Total</th>
          </tr>
          {orderItems?.length > 0 &&
            orderItems?.map((product, index) => (
              <tr key={index} className="order-item">
                <td>{index + 1}</td>
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
              </tr>
            ))}
          <tr>
            <td className="span-item" colSpan={4}></td>
            <td className="heading-title">Sub Total</td>
            <td>{` ${FormatPrice(amountBeforeCoupon)}`}</td>
          </tr>
          <tr>
            <td className="span-item" colSpan={4}></td>
            <td className="heading-title">Delivery</td>
            <td>{FormatPrice(order.delivery_fee)}</td>
          </tr>
          <tr>
            <td className="span-item" colSpan={4}></td>
            <td className="heading-title">Discount</td>
            <td>
              {FormatPrice(
                amountBeforeCoupon - totalPrice + order.custom_discount
              )}
            </td>
          </tr>
          <tr>
            <td className="span-item" colSpan={4}></td>
            <td className="heading-title">Advance</td>
            <td>{FormatPrice(order.advance_payment ?? 0)}</td>
          </tr>
          <tr>
            <td className="span-item" colSpan={4}></td>
            <td className="heading-title">Due Amount</td>
            <td>
              {FormatPrice(
                totalPrice +
                order.delivery_fee -
                order.custom_discount -
                advancePayment
              )}
            </td>
          </tr>

          <div className="payment-status">
            {
              order?.payment_status == 'paid' || order?.payment_status == "Paid" ?

                <div className="img-sec">
                  <img src="/assets/invoice/paid.png" alt="invoice" />

                </div> : ''
            }
            {
              order?.payment_status == 'Paid' || order?.payment_status == "paid" ?
                <span>
                  {order?.note}
                </span> : ''
            }


          </div>
        </table>
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
          {/* 
        <p className=" font-gotham text-xs font-light">
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
        </p> */}
        </div>
      </div>
      <div className="invoice-footer" >
        <div className="title">
          {
            order?.order_form == "web" || order.order_prefix === "GC" ?
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
      {/* <table className="w-full">
        <thead>
          <tr className="secondary-bg text-left table-border">
            <th className="table-border">SL.</th>
            <th className="table-border">Description</th>
            <th className="table-border">Attribute</th>
            <th className="table-border">Qty</th>
            <th className="table-border">Unit Price (BDT)</th>
            <th className="table-border">Total</th>
          </tr>
        </thead>
        <tbody>
          {order?.orderItems?.map((product: any, index: any) => (
            <tr key={index} className="product-a">
              <td className="table-border">{index + 1}</td>
              <td className="table-border">{product.product_name}</td>
              <td className="table-border">
                {product.product_attribute
                  ? JSON.parse(product.product_attribute).map(
                      (v: any, i: number) => (
                        <span className="variant" key={i}>
                          {`${i ? "," : ""}${v.attribute_name}`}
                        </span>
                      )
                    )
                  : "-"}
              </td>
              <td className="table-border"> {product.quantity}</td>
              <td className="table-border"> ৳ {product.discount_price}</td>
              <td className="table-border">
                {" "}
                ৳ {product.discount_price * product.quantity}
              </td>
            </tr>
          ))}

          <tr>
            <td colSpan={4}>
              <h3>Notes:</h3>
              <p>
                1. All our products come with a one-year service warranty. To
                claim the warranty, please present this invoice.
              </p>
              <p>
                2. Please ensure to check for any physical damage to the product
                upon receiving it. After receiving the product, no claims for
                physical damage will be accepted.
              </p>
              <p>
                3. For official installation, please inform us upon receiving
                the product if the customer wishes for us to install it. We will
                require 24 hours to complete the installation.
              </p>
            </td>
            <td>Regular Price</td>
            <td> ৳ {amountBeforeCoupon} </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Delivery</td>
            <td> ৳ {shipingCost}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Discount</td>
            <td>৳ {amountBeforeCoupon - finalPrice}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Total</td>
            <td> ৳ {finalPrice + shipingCost} </td>
          </tr>
        </tbody>
      </table> */}
    </div>
  );
};

export default Invoice;
