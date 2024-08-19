"use client";
import React, { useEffect } from "react";
import "./page.scss";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { clearCart } from "@/redux/features/cart/cartSlice";
import Image from "next/image";

const ConfirmOrder = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearCart());
    setTimeout(() => {
      router.push("/profile/order");
    }, 50000);
  }, [dispatch, router]);

  return (
    <div className="order-confirm">
      <div className="wrapper">
        <div className="icon">
          <Image
  
            src={"/assets/images/payment/Success.png"}
            alt="success"
            width={400}
            height={400}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        {/* <h2 className=" font-gotham font-medium title">Success</h2> */}
        <p className=" font-gotham text">
          We received your purchase request.
          <br /> we&apos;ll be in touch shortly!
        </p>
      </div>
    </div>
  );
};

export default ConfirmOrder;
