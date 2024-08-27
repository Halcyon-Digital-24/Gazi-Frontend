"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { GoDotFill } from "react-icons/go";

import Button from "@/components/button";
import ServiceCard from "@/components/service-card";
import { API_ROOT, API_URL } from "@/constant";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IService } from "@/types/service";
import axios from "axios";
import Image from "next/image";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import "./page.scss";
import FormatPrice from "@/components/price-formate";

function Checkout() {
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);
  const [keyPoints, setKeyPoints] = useState<IService[]>([]);

  const sumWithInitial = cart.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.quantity,
    0
  );

  const fetchService = async () => {
    try {
      const data = await axios.get(`${API_URL}/frontend/keypoints/other`);
      setKeyPoints(data.data?.data?.rows);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  useEffect(() => {
    fetchService();
  }, []);

  return (
    <main>
      {cart.length > 0 ? (
        <section className="cart-page py-5 md:py-20">
          <div className="container px-2 md:px-0">
            <div className="grid grid-cols-12 gap-6">
              {/* main content */}
              <div className=" col-span-12 md:col-span-8">
                <div className="direction-area px-3 md:px-[42px] py-3 md:py-5">
                  <div className="flex justify-between item-wrapper">
                    <div className="flex items-center item flex-col">
                      <FaShoppingCart className="icon text-xl" />
                      <h4 className=" font-gotham font-medium text-sm  ">
                        My Cart
                      </h4>
                    </div>
                    <div className="flex items-center item flex-col">
                      <FaShoppingCart className=" icon text-xl" />
                      <h4 className=" font-gotham font-medium text-sm  ">
                        Payment
                      </h4>
                    </div>
                    <div className="flex items-center item flex-col">
                      <MdVerified className="icon text-xl" />
                      <h4 className=" font-gotham font-medium text-sm  ">
                        Confirmation
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="cart-elements">
                  <div className="grid grid-cols-5 md:grid-cols-8 gap-1 md:gap-4 product-title">
                    <div className="col-span-3 md:col-span-4 flex items-center justify-center">
                      <GoDotFill className="dot-icon" />
                      <h3 className="font-gotham font-medium text-sm md:text-base black-text text-center">
                        Product
                      </h3>
                    </div>
                    <div className="col-span-1 md:col-span-1 flex items-center">
                      <GoDotFill className="dot-icon" />
                      <h3 className="font-gotham font-medium text-sm md:text-base black-text text-center">
                        Price
                      </h3>
                    </div>
                    <div className="hidden md:flex md:col-span-2 items-center">
                      <GoDotFill className="dot-icon" />
                      <h3 className="font-gotham font-medium text-sm md:text-base black-text text-center">
                        Quantity
                      </h3>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <GoDotFill className="dot-icon" />
                      <h3 className="font-gotham font-medium text-sm md:text-base black-text text-center">
                        Total
                      </h3>
                    </div>
                  </div>
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 md:grid-cols-8 gap-1 md:gap-4 items-center product-item"
                    >
                      <div className="col-span-3 md:col-span-4">
                        <div className="flex items-center">
                          <div
                            className="cursor-pointer"
                            onClick={() => dispatch(removeFromCart(item))}
                          >
                            <span>
                              <RxCross2 className="text-sm" />
                            </span>
                          </div>
                          <div className="mx-2 md:mx-9">
                            <Image
                              className="w-full object-cover"
                              src={`${API_ROOT}/images/product/${item.image}`}
                              width={100}
                              height={100}
                              style={{ width: '100%', height: 'auto' }}
                              alt="product"
                            />
                          </div>
                          <div>
                            <h3 className="font-gotham font-medium text-[11px] md:text-sm black-text">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-1">
                        <p className="font-gotham font-medium primary-text text-xs md:text-sm">
                          ৳ {FormatPrice(item.price)}
                        </p>
                      </div>
                      <div className="hidden md:block md:col-span-2">
                        <div className="flex items-center">
                          <div
                            className="qnt-1"
                            onClick={() => dispatch(incrementQuantity(item))}
                          >
                            <AiOutlinePlus className="text-xs md:text-sm" />
                          </div>
                          <div className="qnt-1 px-4 font-gotham font-light text-xs md:text-sm">
                            {item.quantity}
                          </div>
                          <div
                            className="qnt-1"
                            onClick={() => dispatch(decrementQuantity(item))}
                          >
                            <AiOutlineMinus className="text-xs md:text-sm" />
                          </div>
                        </div>
                      </div>
                      <div className=" col-span-1 md:col-span-1">
                        <p className=" font-gotham font-medium primary-text text-sm">
                          ৳ {FormatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <div className="flex justify-center col-span-6 md:hidden">
                        <div className="flex items-center">
                          <div
                            className="qnt-1"
                            onClick={() => dispatch(incrementQuantity(item))}
                          >
                            <AiOutlinePlus className="text-xs md:text-sm" />
                          </div>
                          <div className="qnt-1 px-4 font-gotham font-light text-xs md:text-sm">
                            {item.quantity}
                          </div>
                          <div
                            className="qnt-1"
                            onClick={() => dispatch(decrementQuantity(item))}
                          >
                            <AiOutlineMinus className="text-xs md:text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
              {/* summery */}
              <div className=" col-span-12 md:col-span-4">
                <div className="p-3 md:p-9 cart-summery">
                  <h3 className="summery-border font-gotham font-medium text-base black-text pb-2">
                    Cart Summary
                  </h3>

                  <div className="flex justify-between items-center mt-3 md:mt-14 summery-border pb-3">
                    <p className=" font-gotham font-medium text-sm black-text">
                      Sub Total
                    </p>
                    <p className=" font-gotham font-medium text-sm primary-text">
                      ৳ {FormatPrice(sumWithInitial)}
                    </p>
                  </div>
                  <Link className="mt-5 md:mt-14 block" href={"/checkout"}>
                    <Button className="w-full font-gotham font-medium text-lg py-1">
                      Continue to Shipping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="container py-28 font-gotham text-center">
          <Image

            className=" mx-auto"
            src="/assets/images/service/empty-cart.png"
            alt="empty-cart"
            width={100}
            height={100}
          />
          <p>Your cart is Empty</p>
          <Link href={`/`}>
            <Button className="px-2 py-1 mt-2">Continue Shopping</Button>
          </Link>
        </div>
      )}
      {keyPoints.length > 0 && (
        <section className="cart-service">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-4">
              {keyPoints.map((service, i) => (
                <ServiceCard key={i} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Checkout;
