"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import "./index.scss";
import { ICategoryData } from "@/types/category";
import { API_ROOT } from "@/constant";
import { useAppDispatch } from "@/redux/hooks";
import { addCategory } from "@/redux/features/category/categorySlice";

interface IProps {
  item: ICategoryData;
  className?: string;
  href?: string;
}
const ExploreCard: React.FC<IProps> = ({
  item,
  className,
}): React.JSX.Element => {
  const dispatch = useAppDispatch();
  return (
    <div
      className={`${className} explore-card`}
      onClick={() =>
        dispatch(addCategory({ title: item.title, slug: item.slug }))
      }
    >
      <Link
        className="explore-item"
        href={`/category/filter?category=${item.slug}`}
      >
        <Image
          src={`${API_ROOT}/images/category/${item.image}`}
          width={150}
          height={150}
          alt="explore"
          quality={100}
        />
        <p className=" mt-5 text-sm font-gotham font-medium font-sm uppercase">
          {item.title}
        </p>
      </Link>
    </div>
  );
};

export default ExploreCard;
