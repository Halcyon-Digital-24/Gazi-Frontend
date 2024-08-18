"use client";
import Button from "@/components/button";
import FormatPrice from "@/components/price-formate";
import ServiceCard from "@/components/service-card";
import { API_ROOT, API_URL } from "@/constant";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { clearLoginInfo } from "@/redux/features/login/loginSlice";
import {
  clearWishList,
  removeFromWishList,
  setWishList,
} from "@/redux/features/wish-list/wishListSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import "./page.scss";
import { GoDotFill } from "react-icons/go";
import { IService } from "@/types/service";
import Link from "next/link";

function WishlistPage() {
  const [keyPoints, setKeyPoints] = useState<IService[]>([]);
  const [wishListItems, setWishListItems] = useState<any[]>([]);
  const { login } = useAppSelector((state) => state.login);
  const dispatch = useAppDispatch();
  const route = useRouter();

  const getWishListItems = useCallback(async () => {
    if (login?.accessToken) {
      try {
        const response = await axiosInstance.get(`/customers/wishlists`, {
          headers: {
            Authorization: `Bearer ${login?.accessToken}`,
          },
        });
        if (response.status === 200) {
          setWishListItems(response?.data);
          dispatch(setWishList(response?.data));
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          dispatch(clearWishList());
          dispatch(clearLoginInfo());
          route.push("/login");
        }
        console.error("Error fetching data:", error);
      }
    }
  }, [login?.accessToken, dispatch, route]);

  const handleRemoveItem = async (wishlistID: number, productID: number) => {
    if (login?.accessToken && login?.user?.id) {
      try {
        const response = await axiosInstance.delete(
          `/wishlists?ids=[${wishlistID}]`,
          {
            headers: {
              Authorization: `Bearer ${login?.accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Item removed successfully!");
          dispatch(
            removeFromWishList({
              product_id: productID,
              user_id: login?.user?.id,
            })
          );
          getWishListItems();
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const fetchService = async () => {
    try {
      const data = await axios.get(`${API_URL}/frontend/keypoints/other`);
      setKeyPoints(data.data?.data?.rows);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (!login?.accessToken) {
      route.push("/login");
    }
    getWishListItems();
    fetchService();
  }, [login?.accessToken, route, getWishListItems]);

  return (
    <main>
      <section className="wishlist-page">
        <div className="container px-2 md:px-0">
          <h2 className=" font-gotham font-medium text-lg wish-heading mb-1  pb-1">
            Wishlist
          </h2>
          <div className="cart-elements">
            <div className="grid grid-cols-8 gap-4 product-title">
              <div className=" col-span-4 flex items-center justify-center">
                <GoDotFill className="dot-icon" />
                <h3 className="w1/2 font-gotham font-medium text-base black-text">
                  Product Name
                </h3>
              </div>
              <div className="col-span-1 flex items-center ">
                <GoDotFill className="dot-icon" />
                <h3 className=" font-gotham font-medium text-base black-text text-center">
                  Price
                </h3>
              </div>
              <div className=" hidden col-span-2 md:flex items-center">
                <GoDotFill className="dot-icon" />
                <h3 className=" font-gotham font-medium text-base black-text text-center">
                  Stock Status
                </h3>
              </div>
              <div className="col-span-1 flex items-center"></div>
            </div>
            {wishListItems.length > 0 &&
              wishListItems.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-8 gap-4 items-center product-item"
                >
                  <div className="col-span-4">
                    <div className="flex items-center">
                      <div
                        className=" cursor-pointer"
                        onClick={() =>
                          handleRemoveItem(item.wishlist_id, item?.id)
                        }
                      >
                        <span>
                          <RxCross2 className="text-xs " />
                        </span>
                      </div>
                      <div className="w-[80px] mx-2 md:mx-9">
                        <Image
                          className=" w-full object-cover"
                          src={`${API_ROOT}/images/product/${item.image}`}
                          width={200}
                          height={200}
                          alt="product"
                        />
                      </div>
                      <div>
                        <h3 className=" font-gotham font-medium text-sm black-text">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-1 col-span-2">
                    <p className=" font-gotham font-medium primary-text text-xs">
                      ৳ {FormatPrice(item.discount_price)}
                    </p>
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <h3 className="font-gotham font-medium text-sm">
                      {item.ProductAttribute && item.ProductAttribute.length > 0
                        ? item.ProductAttribute.some((attr: { attribute_quantity: number; }) => attr.attribute_quantity > 0) && item.availability === 1
                          ? "In Stock"
                          : "Out of Stock"
                        : item.availability === 1
                          ? "In Stock"
                          : item.availability === 2
                            ? "Out of Stock"
                            : item.availability === 3
                              ? "Up Coming"
                              : ""}
                    </h3>

                  </div>
                  <div className="md:col-span-1 col-span-2">
                    <div>
                      {item.ProductAttribute && item.ProductAttribute.length > 0 ? (
                        // Check if all attributes are out of stock
                        item?.ProductAttribute?.every((attr: { attribute_quantity: number; }) => attr?.attribute_quantity === 0) ? (
                          <Button className="px-4 py-1 font-gotham font-medium text-sm w-btn btn__disable stock-out">
                            Out of Stock
                          </Button>
                        ) : (
                          // At least one attribute has stock, show "View"
                          <Link href={`/product/${item.url}`}>
                            <Button className="px-6 py-1 font-gotham font-medium text-sm w-btn">
                              View
                            </Button>
                          </Link>
                        )
                      ) : (
                        // No attributes, fallback to standard availability logic
                        <>
                          {item.availability === 1 ? (
                            <Button
                              className="px-6 py-1 font-gotham font-medium text-sm w-btn"
                              onClick={() =>
                                dispatch(
                                  addToCart({
                                    product_id: Number(item.id),
                                    price: item.discount_price,
                                    title: item.title,
                                    image: item.image,
                                    quantity: 1,
                                    regular_price: item.regular_price,
                                  })
                                )
                              }
                            >
                              Add to Cart
                            </Button>
                          ) : item.availability === 2 ? (
                            <Button className="px-4 py-1 font-gotham font-medium text-sm w-btn btn__disable stock-out">
                              Out of Stock
                            </Button>
                          ) : (
                            <Button className="px-6 py-1 font-gotham font-medium text-sm w-btn">
                              Up Coming
                            </Button>
                          )}
                        </>
                      )}
                    </div>

                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      {keyPoints.length > 0 && (
        <section className="cart-service">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

export default WishlistPage;
