"use client";
import React, { useEffect } from "react";
import "./page.scss";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import Image from "next/image";

type Props = {
  params: {
    id: string;
  };
};

const CancelOrder = ({ params: { id } }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearCart());
    setTimeout(() => {
      router.push("/");
    }, 50000);
  }, [dispatch, router]);

  return (
    <div className="order-cancel">
      <div className="wrapper">
        <div className="icon">
          <Image
  
            src={"/assets/images/payment/Canceled.png"}
            alt="success"
            width={400}
            height={400}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        <h2 className=" font-gotham font-medium title">Canceled !</h2>
        <p className=" font-gotham text">
          We don&apos;t received your purchase request.
          <br />
          Please Try Again !
        </p>
      </div>
    </div>
  );
};

export default CancelOrder;
