"use client";
import { API_ROOT } from "@/constant";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { addToCompare } from "@/redux/features/compare/compareSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ICartItem } from "@/types/cart";
import { ICompareItem } from "@/types/compare";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsArrowRepeat, BsHeart } from "react-icons/bs";
import { toast } from "react-toastify";
import Button from "../button";
import EmiPopup from "../emi-popup";
import FormatPrice from "../price-formate";
import StarRating from "../rating";
import "./index.scss";
import axiosInstance from "../../../utils/axiosInstance";
import { addToWishList } from "@/redux/features/wish-list/wishListSlice";

interface IProps {
  product: any;
}

const ListCard: FC<IProps> = ({ product }) => {
  const [isEmi, setIsEmi] = useState(false);
  const handleEmi = () => setIsEmi(!isEmi);
  const { login } = useAppSelector((state) => state.login);
  const { data: compareItems } = useAppSelector((state) => state.compare);
  /*  const isCampaign =
    product.camping_start_date &&
    product.camping_end_date &&
    new Date(product.camping_start_date).getTime() <= Date.now() &&
    new Date(product.camping_end_date).getTime() >= Date.now(); */
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleBuyNow = (data: ICartItem) => {
    dispatch(addToCart(data));
    router.push("/cart");
  };

  const addCompare = (data: ICompareItem) => {
    if (compareItems.length < 4) {
      dispatch(addToCompare(data));
    } else {
      toast.error(
        "You already have added 4 products in your compare list. Please remove one of them from compare page to add a new one."
      );
    }
  };

  const addWishList = async () => {
    if (login?.accessToken && login?.user?.id) {
      try {
        const response = await axiosInstance.post(
          `/wishlists`,
          {
            product_id: product.id,
            user_id: login?.user?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${login?.accessToken}`,
            },
          }
        );
        if (response.status === 201) {
          dispatch(
            addToWishList({
              product_id: response.data.wishlist.product_id,
              user_id: response.data.wishlist.user_id,
            })
          );
        } else {
          // toast.warning('Item already added in your wish list!');
          toast.warning(`${response.data.message}`);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="list-card flex  py-5">
      <div className="image md:w-[30%] w-[40%] relative flex items-center justify-center  box-border">
        <Link
          href={`/product/${product.slug}`}
          className="font-gotham font-medium text-sm inline-block primary-text primary-hover w-full"
        >
          <div className="pr-1">
            <Image
              className=" w-full h-auto object-cover"
              src={`${API_ROOT}/images/product/${product.image}`}
              width={400}
              height={400}
              alt="product"
            />
          </div>
        </Link>
        <div className=" absolute left-0 top-0">
          {Number(product.regular_price) > 0 && Number(product.discount_price) > 0 && (
            (() => {
              const discountPercent =
                ((Number(product.regular_price) - Number(product.discount_price)) /
                  Number(product.regular_price)) *
                100;

              // Only show the discount percentage if it is greater than 0
              if (discountPercent > 0) {
                return (
                  <span className="sudo inline-block discount font-gotham text-xs font-bold px-2 py-1 rounded primary-text">
                    - {discountPercent % 1 !== 0
                      ? discountPercent.toFixed(2) // Show 2 decimal points if fractional
                      : discountPercent.toString()}%
                  </span>
                );
              }
              return null; // Do not render anything if the discount is 0%
            })()
          )}

          {product.is_new ? (
            <span className=" sudo inline-block new font-gotham text-[10px] md:text-xs font-medium px-1 md:px-2 py-1  rounded primary-text">
              New
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="details md:w-[50%] w-[35%] relative">
        <Link
          href={`/product/${product.slug}`}
          className="font-gotham font-medium text-sm  primary-text primary-hover"
        >
          {product.title}
        </Link>
        <div className="flex flex-wrap items-center mt-1 md:mt-3 review">
          <StarRating
            rating={Math.round(product?.reviews ? product?.reviews[0]?.average_rating ?? 0 : 0)}
          />
          <span className="font-gotham font-normal w-full md:w-auto text-xs ml-0 md:ml-2">
            Reviews ({Math.round(product?.reviews ? product?.reviews[0]?.average_rating ?? 0 : 0)})
          </span>
        </div>
        {/*  <h4 className=" font-gotham font-medium text-xs black-text md:mt-9 mt-5">
          Brand: Gazi
        </h4> */}
        <h3
          className="font-gotham font-medium text-xs primary-text cursor-pointer md:mt-10 mt-4 hover-text-color"
          onClick={() => setIsEmi(true)}
        >
          Avail Bank EMI
        </h3>

        <div className="flex flex-wrap md:mt-7 mt-3">
          <div
            className="flex items-center mr-2 cursor-pointer interaction"
            onClick={() =>
              addCompare({
                product_id: product.id,
                description: product.sort_description ?? "",
                image: product.image,
                title: product.title,
                slug: product?.slug,
                regular_price: Number(product.regular_price),
                price:
                  Number(product.discount_price) > 0
                    ? Number(product.discount_price)
                    : Number(product.regular_price),
                default_quantity: product.default_quantity,
                rating: Math.round(product?.reviews[0]?.average_rating),
                availability: product.availability,
                productAttribute: product.productAttribute,
              })
            }
          >
            <div className="icon-area p-1">
              <BsArrowRepeat className=" text-xs icon" />
            </div>
            <p className="font-gotham font-normal text-xs icon-title">
              Compare
            </p>
          </div>
          <div
            className="flex items-center mr-2 mt-2 md:mt-0 cursor-pointer interaction"
            onClick={addWishList}
          >
            <div className="icon-area p-1">
              <BsHeart className=" text-xs icon" />
            </div>
            <p className="font-gotham font-normal text-xs icon-title">
              Wishlist
            </p>
          </div>
          {!(product.ProductAttribute && product.ProductAttribute.some((attr: any) => attr.attribute_quantity > 0)) && (
            <div className="flex items-center mr-2 mt-2 md:mt-0 cursor-pointer interaction">
              <div className="icon-area p-1">
                <AiOutlinePlus className="text-xs icon" />
              </div>
              <p
                className="font-gotham font-normal text-xs icon-title"
                onClick={() =>
                  dispatch(
                    addToCart({
                      product_id: product.id,
                      price: Number(product.discount_price) > 0
                        ? Number(product.discount_price)
                        : Number(product.regular_price),
                      title: product.title,
                      image: product.image,
                      quantity: 1,
                      regular_price: Number(product.regular_price),
                    })
                  )
                }
              >
                Add To Cart
              </p>
            </div>
          )}

        </div>
      </div>
      <div className="image w-[25%] ml-2 md:ml-0 relative">
        <h3 className="font-gotham font-medium primary-text stock pb-1 mb-4 text-sm md:text-base">
          {product.ProductAttribute && product.ProductAttribute.length > 0
            ? product.ProductAttribute.some((attr: { attribute_quantity: number }) => attr.attribute_quantity > 0)
              ? product.availability === 1
                ? "In Stock"
                : product.availability === 2
                  ? "Out of Stock"
                  : product.availability === 3
                    ? "Up Coming"
                    : ""
              : "Out of Stock"
            : product.availability === 1
              ? product.default_quantity > 0
                ? "In Stock"
                : "Out of Stock"
              : product.availability === 2
                ? "Out of Stock"
                : product.availability === 3
                  ? "Up Coming"
                  : ""}

        </h3>
        {
          product.discount_price > 0
            && Number(product?.discount_price) != Number(product?.regular_price) ?
            <h4
              className={` font-gotham text-xs line-through font-normal primary-text`}
            >
              ৳ {FormatPrice(product.regular_price)}
            </h4> : null
        }

        <div className="flex justify-between flex-wrap items-center">
          {Number(product.regular_price) && (
            <h3 className=" font-gotham font-medium text-base primary-text">
              ৳ {FormatPrice(product.discount_price)}
            </h3>
          )}
          {product?.discount_price > 0 &&
            product?.discount_price !==
            product.regular_price && (
              <span className=" font-gotham font-normal md:text-xs text-[10px]  px-1 py-[2px] save-text save-money">
                Save ৳{" "}
                {FormatPrice(
                  Number((Number(product.regular_price) - Number(product.discount_price)).toFixed(2))
                )}
              </span>
            )}
        </div>
        {product.availability === 1 ? (
          <>
            {product.ProductAttribute && product.ProductAttribute.length > 0 ? (
              product.ProductAttribute.some((attr: any) => attr.attribute_quantity > 0) ? (
                <Link href={`/product/${product.slug}`}>
                  <Button className="md:w-full px-3 md:px-0 font-gotham font-medium text-[14px] md:text-sm py-1 mt-4 product-btn">
                    View
                  </Button>
                </Link>
              ) : (
                <Button className="md:w-full px-2 md:px-0 font-gotham font-medium text-[12px] md:text-sm py-1 mt-4 product-btn stock-out">
                  Out of Stock
                </Button>
              )
            ) : (
              product.default_quantity > 0 ? (
                <Button
                  className="md:w-full px-3 md:px-0 font-gotham font-medium text-[14px] md:text-sm py-1 mt-4 product-btn"
                  onClick={() => {
                    handleBuyNow({
                      product_id: product.id,
                      price: Number(product.discount_price) > 0
                        ? Number(product.discount_price)
                        : Number(product.regular_price),
                      title: product.title,
                      image: product.image,
                      quantity: 1,
                      regular_price: Number(product.regular_price),
                    });
                  }}
                >
                  Buy Now
                </Button>
              ) : (
                <Button className="md:w-full px-2 md:px-0 font-gotham font-medium text-[12px] md:text-sm py-1 mt-4 product-btn stock-out">
                  Out of Stock
                </Button>
              )
            )}
          </>
        ) : product.availability === 2 ? (
          <Button className="md:w-full px-2 md:px-0 font-gotham font-medium text-[12px] md:text-sm py-1 mt-4 product-btn stock-out">
            Out of Stock
          </Button>
        ) : product.availability === 3 ? (
          <Button className="md:w-full px-3 md:px-0 font-gotham font-medium text-[14px] md:text-sm py-1 mt-4 product-btn">
            Up Coming
          </Button>
        ) : null}


      </div>
      {isEmi && (
        <EmiPopup
          price={
            product.discount_price > 0
              ? product.discount_price
              : product.regular_price
          }
          handleEmi={handleEmi}
        />
      )}
    </div>
  );
};

export default ListCard;
