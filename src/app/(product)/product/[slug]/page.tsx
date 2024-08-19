"use client";
import Button from "@/components/button";
import EmiPopup from "@/components/emi-popup";
import FormGroup from "@/components/fromgroup";
import OutlineButton from "@/components/outline-button";
import FormatPrice from "@/components/price-formate";
import StarRating from "@/components/rating";
import ReviewCard from "@/components/review-card";
import SharePopUp from "@/components/share-popup";
import TextAreaGroup from "@/components/textarea";
import Title from "@/components/title";
import { API_ROOT, API_URL } from "@/constant";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { addToCompare } from "@/redux/features/compare/compareSlice";
import { addToWishList } from "@/redux/features/wish-list/wishListSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IBanner } from "@/types/banner";
import { ICartItem } from "@/types/cart";
import { ICompareItem } from "@/types/compare";
import { ISingleProduct } from "@/types/product";
import { IService } from "@/types/service";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AiOutlineHeart,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { Controller, useForm } from "react-hook-form";
import { BsArrowRepeat } from "react-icons/bs";
import { FaAward } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Slider from "react-slick";
import StarRatings from "react-star-ratings";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../utils/axiosInstance";
import "./page.scss";
import "react-quill/dist/quill.snow.css";
// import ZoomImage from "@/components/zoom-image";
import CircleLoader from "@/components/css-loader";
import Link from "next/link";
const ZoomImage = dynamic(() => import("@/components/zoom-image"));
const ProductCard = dynamic(() => import("@/components/card"));

type IUniqueAttributes = {
  [key: string]: string[];
};
type Inputs = {
  email: string;
  comment: string;
  name: string;
  rating: number;
  number: number | string;
  question: string;
};
type Props = {
  params: {
    slug: string;
  };
};

async function getProduct(slug: string) {
  const res = await fetch(`${API_URL}/frontend/products/${slug} `);
  const data = await res.json();
  return data;
}

const PageDetails = ({ params: { slug } }: Props) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const [product, setProduct] = useState<ISingleProduct | null>(null);
  const { login } = useAppSelector((state) => state.login);
  const { data: compareItems } = useAppSelector((state) => state.compare);
  const router = useRouter();

  const [adsBanner, setAdsBanner] = useState<IBanner>({} as IBanner);
  const [quantity, setQuantity] = useState<number>(1);
  const [viewImage, setViewImag] = useState<string>(
    product?.productPhotos[0]?.image as string
  );
  const dispatch = useAppDispatch();
  const [keyPoints, setKeyPoints] = useState<IService[]>([]);
  const [isEmi, setIsEmi] = useState(false);
  const [emiPRice, setEmiPrice] = useState<number>(0);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [selectAttributes, setSelectedAttribute] = useState<any[]>([]);
  const [bankList, setBankList] = useState<IEmiResponse>({} as IEmiResponse);
  const [selectedAttributes, setSelectedAttributes] = useState<any[]>([]);

  /* const isCampaign =
    product?.product?.camping_start_date &&
    product?.product?.camping_end_date &&
    new Date(product.product.camping_start_date).getTime() <= Date.now() &&
    new Date(product.product.camping_end_date).getTime() >= Date.now(); */
  const handleEmi = () => setIsEmi(!isEmi);
  const productPrice = product?.product?.discount_price
    ? product?.product?.discount_price
    : product?.product?.regular_price;
  const handleAttributeClick = (attribute: any) => {
    const isExists = selectedAttributes.filter(
      (attr) =>
        attr.attribute_id === attribute.id ||
        attr.attribute_key === attribute.attribute_key ||
        attr.attribute_name === attribute.attribute_value
    );
    if (isExists.length < 1) {
      setSelectedAttributes((prev) => [
        ...prev,
        {
          attribute_id: attribute.id,
          attribute_name: attribute.attribute_value,
          attribute_quantity: quantity,
          attribute_key: attribute.attribute_key,
        },
      ]);
    } else {
      const sameType = selectedAttributes.filter(
        (attr) => attr.attribute_key !== attribute.attribute_key
      );
      setSelectedAttributes([
        ...sameType,
        {
          attribute_id: attribute.id,
          attribute_name: attribute.attribute_value,
          attribute_quantity: quantity,
          attribute_key: attribute.attribute_key,
        },
      ]);
    }
  };

  const handleViewImage = (url: string) => {
    setViewImag(url);
  };

  useEffect(() => {
    let tempSelAttr: any[] = [];
    attributes?.map((attr) => {
      attr?.values?.map((val: any) => {
        if (val?.checked) {
          tempSelAttr.push({ name: attr.name, value: val.name });
        }
      });
    });
    setSelectedAttribute(tempSelAttr);
  }, [attributes]);

  const increment = () => {
    if (quantity < 5) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleBuyNow = (data: ICartItem) => {
    dispatch(addToCart(data));
    router.push("/cart");
  };

  const fetchProduct = async () => {
    try {
      const data = await getProduct(slug);
      setProduct(data?.data);
      /* 
      let tempArr: any[] = [];
      data?.data?.productAttribute?.length > 0 &&
        data?.data?.productAttribute?.map((attr: any) => {
          let tempValuesArr: string[] = attr?.attribute_value?.split(",");
          let tempValuesArrObjs: any[] = tempValuesArr.map((val) => {
            return { name: val, checked: false };
          });
          tempArr.push({
            name: attr?.attribute_key,
            values: [...tempValuesArrObjs],
          });
        });
      setAttributes([...tempArr]); */
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchService = async () => {
    try {
      const data = await axios.get(`${API_URL}/frontend/keypoints/product`);
      setKeyPoints(data.data?.data?.rows);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  async function categoryAdBanner() {
    try {
      const data = await axios.get(
        `${API_URL}/banners/${product?.product?.category_slug}`
      );
      setAdsBanner(data.data?.data[0]);
    } catch (error) {
      console.log("category ads banner" + error);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    fetchService();
  }, []);

  useEffect(() => {
    categoryAdBanner();
  }, [product?.product?.category_slug]);

  useEffect(() => {
    let smallestPrice = Infinity;
    bankList?.data?.rows.forEach((bank) => {
      let subTotalPrice = 0;
      let price =
        (product?.product?.discount_price ?? 0) > 0
          ? product?.product?.discount_price ?? 0
          : product?.product?.regular_price ?? 0;

      // Calculate subTotalPrice and comparePrice for each EMI tenure
      if (bank.three_months) {
        subTotalPrice = price + (price * bank.three_months) / 100;

        const comparePrice = subTotalPrice / 3;
        if (comparePrice < smallestPrice) {
          smallestPrice = comparePrice;
        }
      }

      if (bank.six_months) {
        subTotalPrice = price + (price * bank.six_months) / 100;
        const comparePrice = subTotalPrice / 6;
        if (comparePrice < smallestPrice) {
          smallestPrice = comparePrice;
        }
      }

      if (bank.nine_months) {
        subTotalPrice = price + (price * bank.nine_months) / 100;
        const comparePrice = subTotalPrice / 9;
        if (comparePrice < smallestPrice) {
          smallestPrice = comparePrice;
        }
      }
      if (bank.twelve_months) {
        subTotalPrice = price + (price * bank.twelve_months) / 100;
        const comparePrice = subTotalPrice / 12;
        if (comparePrice < smallestPrice) {
          smallestPrice = comparePrice;
        }
      }
      if (bank.eighteen_months) {
        subTotalPrice = price + (price * bank.eighteen_months) / 100;
        const comparePrice = subTotalPrice / 18;
        if (comparePrice < smallestPrice) {
          smallestPrice = comparePrice;
        }
      }
      if (bank.twenty_four_months) {
        subTotalPrice = price + (price * bank.twenty_four_months) / 100;
        const comparePrice = subTotalPrice / 24;
        if (comparePrice < smallestPrice) {
          smallestPrice = comparePrice;
        }
      }
      if (bank.thirty_months) {
        subTotalPrice = price + (price * bank.thirty_months) / 100;
        const comparePrice = subTotalPrice / 30;
        if (comparePrice < smallestPrice) {
          smallestPrice = comparePrice;
        }
      }
      if (bank.thirty_six_months) {
        subTotalPrice = price + (price * bank.thirty_six_months) / 100;
        const comparePrice = subTotalPrice / 36;
        if (comparePrice < smallestPrice) {
          smallestPrice = comparePrice;
        }
      }
    });

    setEmiPrice(smallestPrice); // Update state with the smallestPrice
  }, [bankList, product]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: true,
    prevArrow: <IoIosArrowBack className="text-base" />,
    nextArrow: <IoIosArrowForward />,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // Extract video ID and generate thumbnail for YouTube videos
  useEffect(() => {
    if (product?.product?.video_url) {
      const videoId = extractYouTubeId(product.product.video_url);
      if (videoId) {
        setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
      }
    }
  }, [product?.product?.video_url]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleSubmitQuestion = async (data: any) => {
    const { question, number } = data;
    const reviewData = {
      question,
      mobile: number,
      product_id: product?.product?.id,
      product_name: product?.product?.title,
    };
    try {
      const response = await axios.post(
        `${API_URL}/product-querys`,
        reviewData
      );
      if (response.status === 201) {
        toast.success(response?.data?.message);
        setValue("number", "");
        setValue("question", "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addWishList = async (productID: Number) => {
    if (login?.accessToken && login?.user?.id) {
      try {
        const response = await axiosInstance.post(
          `/wishlists`,
          {
            product_id: productID,
            user_id: login?.user?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${login?.accessToken}`,
            },
          }
        );
        if (response.status == 201) {
          dispatch(
            addToWishList({
              product_id: response.data.data.product_id,
              user_id: response.data.data.user_id,
            })
          );
        } else {
          console.log("Status : ", response.status);
          toast.warning(`${response.data.data}`);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      router.push("/login");
    }
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

  const onSubmit = async (data: any) => {
    if (product?.product?.id) {
      try {
        const response = await axios.post(`${API_URL}/reviews`, {
          product_id: product?.product?.id,
          product_name: product?.product?.title,
          user_id: login?.user?.id,
          ...data,
          /* name: firstName,
          comment: review,
          rating: rating, */
          is_visible: "0",
        });
        if (response?.status === 201) {
          toast.success("Review post success!");
          setValue("rating", 0);
          setValue("comment", "");
          setValue("name", "");
          setValue("email", "");

          /* setRating(0);
          setReview("");
          setFirstName("");
          setEmail(""); */
          fetchProduct();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  /* const handleAttributeClick = (attrName: string, valName: string) => {
    setAttributes((prevState) => {
      return prevState.map((attr) => {
        if (attr.name === attrName) {
          attr.values = attr.values.map((val: any) => {
            if (val.name === valName) {
              val.checked = true;
            } else {
              val.checked = false;
            }
            return val;
          });
          return attr;
        } else {
          return attr;
        }
      });
    });
  }; */
  const smallestOrderPhoto =
    (product?.productPhotos?.length as number) > 0
      ? (product as ISingleProduct).productPhotos.reduce((prev, current) =>
        prev.order_number < current.order_number ? prev : current
      )
      : null;

  useEffect(() => {
    const fetchBank = async () => {
      try {
        const data = await axios.get(`${API_URL}/emis`);
        setBankList(data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchBank();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return <CircleLoader />;
  };
  return (
    <>
      {product && (
        <section>
          <div className="product-details overflow-hidden">
            <div className="container px-2 md:px-1">
              <div className="product-specification">
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-6">
                  <div>
                    <div className="view-image mt-3 md:mt-0 overflow-hidden">
                      <ZoomImage
                        image={
                          viewImage
                            ? `${API_ROOT}/images/product/${viewImage}`
                            : `${API_ROOT}/images/product/${smallestOrderPhoto?.image}`
                        }
                      />
                    </div>
                    <div className="px-5 mt-5 products">
                      <Slider {...settings}>
                        {product.productPhotos
                          .sort(
                            (a, b) =>
                              (a.order_number || 0) - (b.order_number || 0)
                          )
                          .map((productImage, index) => (
                            <div
                              key={index + 1}
                              className="mx-1 product-item"
                              onClick={() =>
                                handleViewImage(productImage.image)
                              }
                            >
                              <Image
                                className=" w-full cursor-pointer"
                                src={`${API_ROOT}/images/product/${productImage.image}`}
                                alt="product"
                                width={80}
                                height={80}
                                quality={100}
                              />
                            </div>
                          ))}
                      </Slider>
                    </div>
                  </div>

                  <div>
                    <h2 className=" font-gotham font-medium text-xl black-text mb-1  transition-all">
                      {product?.product?.title}
                    </h2>
                    <div className="flex items-center primary-text font-gotham">
                      <div className="flex items-center">
                        <StarRating rating={product?.averageReview} />
                        <span className="ml-1 font-gotham text-xs">
                          {" "}
                          Review
                        </span>
                      </div>
                    </div>

                    <div className="price-area py-3 mt-2">
                      <div className="flex items-center">
                        <h3 className=" font-gotham font-medium text-xs black-text mr-3">
                          Regular Price:
                        </h3>
                        <h2
                          className={`font-gotham  text-xl font-medium ${product?.product?.discount_price > 0 &&
                            product?.product?.regular_price !==
                            product?.product?.discount_price
                            ? " line-through font-normal r-price "
                            : "primary-text"
                            }  `}
                        >
                          ৳{FormatPrice(product?.product?.regular_price)}
                        </h2>
                      </div>
                      {product?.product?.discount_price > 0 &&
                        product?.product?.discount_price !==
                        product.product.regular_price && (
                          <div className="flex items-center">
                            <h3 className=" font-gotham font-medium text-xs black-text mr-3">
                              Discount Price:
                            </h3>
                            <div className="flex">
                              <h2 className="font-gotham  text-2xl primary-text font-medium d-price">
                                ৳{FormatPrice(product?.product?.discount_price)}
                              </h2>
                              <div>
                                <span className="discount font-medium">
                                  Save ৳
                                  {FormatPrice(product.product.regular_price -
                                    product.product.discount_price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                    {(productPrice as number) > 5000 && (
                      <div className="e-emi">
                        <h3 className=" font-gotham font-medium text-sm primary-text hover-text-color py-3 cursor-pointer">
                          <span
                            className="cursor-point"
                            onClick={() => setIsEmi(true)}
                          >
                            Avail Bank EMI | EMI From{" "}
                            {FormatPrice(Math.ceil(emiPRice))} Tk/month
                          </span>
                        </h3>
                      </div>
                    )}

                    {product.productAttribute &&
                      product.productAttribute.length > 0 && (
                        <div className="attribute py-2">
                          <>
                            {(() => {
                              const uniqueAttributes: IUniqueAttributes = {};

                              product.productAttribute?.forEach((attr) => {
                                if (!uniqueAttributes[attr.attribute_key]) {
                                  uniqueAttributes[attr.attribute_key] = [];
                                }
                                uniqueAttributes[attr.attribute_key].push(
                                  attr.attribute_value
                                );
                              });

                              return Object.keys(uniqueAttributes).map(
                                (key, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center mb-1"
                                  >
                                    <div className="font-gotham font-bold primary-text text-xs mr-2">
                                      {key.replace("_", " ")} :{" "}
                                    </div>
                                    <div className="flex">
                                      {uniqueAttributes[key].map((value, j) => {
                                        const findAttribute =
                                          product.productAttribute?.find(
                                            (att) =>
                                              att.attribute_key === key &&
                                              att.attribute_value === value
                                          );

                                        return (
                                          <div
                                            key={j}
                                            className={`pointer select font-gotham text-sm px-2 py-[2px] mr-1 ${selectedAttributes.find(
                                              (item) =>
                                                item.attribute_id ===
                                                findAttribute?.id
                                            )
                                              ? "selected white-text"
                                              : ""
                                              } ${(findAttribute?.attribute_quantity as number) <=
                                                0
                                                ? "disabled-attribute"
                                                : ""
                                              }`}
                                            onClick={() => {
                                              (findAttribute?.attribute_quantity as number) >
                                                0 &&
                                                handleAttributeClick(
                                                  findAttribute
                                                );
                                              handleViewImage(
                                                product.productAttribute?.find(
                                                  (att) =>
                                                    att.attribute_key === key &&
                                                    att.attribute_value ===
                                                    value
                                                )?.attrbute_image as string
                                              );
                                            }}
                                          >
                                            {value}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )
                              );
                            })()}
                          </>
                        </div>
                      )}
                    {product?.product?.availability === 1 &&
                      product?.product?.default_quantity > 0 &&
                      (!product?.productAttribute ||
                        product?.productAttribute.some(attr => attr.attribute_quantity > 0)) && (
                        <div className="action">
                          <div className="flex pt-5 font-gotham font-medium">
                            <div className="mr-2 flex items-center primary-text border">
                              <div
                                className="quantity cursor-pointer white-hover-text primary-hover-bg"
                                onClick={decrement}
                              >
                                <button>
                                  <AiOutlineMinus />
                                </button>
                              </div>
                              <div className="quantity border-x-[1px] border-x-primary">
                                {quantity}
                              </div>
                              <div
                                className="quantity cursor-pointer white-hover-text primary-hover-bg"
                                onClick={increment}
                              >
                                <button>
                                  <AiOutlinePlus />
                                </button>
                              </div>
                            </div>
                            <Button
                              className="px-5 py-1 mr-2"
                              onClick={() => {
                                if (
                                  product?.productAttribute &&
                                  product?.productAttribute.length > 0 &&
                                  selectedAttributes.length < 1
                                ) {
                                  toast.error("Please Select Variant");
                                  return;
                                }
                                handleBuyNow({
                                  product_id: Number(product.product.id),
                                  price:
                                    product.product.discount_price > 0
                                      ? product.product.discount_price
                                      : product.product.regular_price,
                                  title: product.product.title,
                                  image: product.product.image,
                                  quantity: quantity,
                                  regular_price: product.product.regular_price,
                                  attribute: selectedAttributes,
                                });
                              }}
                            >
                              Buy Now
                            </Button>
                            <Button
                              className="px-5 py-1"
                              onClick={() => {
                                if (
                                  product?.productAttribute &&
                                  product?.productAttribute.length > 0 &&
                                  selectedAttributes.length < 1
                                ) {
                                  toast.error("Please Select Variant");
                                  return;
                                }
                                dispatch(
                                  addToCart({
                                    product_id: Number(product.product.id),
                                    price:
                                      product.product.discount_price > 0
                                        ? product.product.discount_price
                                        : product?.product?.regular_price,
                                    title: product.product.title,
                                    image: product.product.image,
                                    quantity: quantity,
                                    regular_price: product.product.regular_price,
                                    attribute: selectedAttributes,
                                  })
                                );
                              }}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      )}

                    {(product?.product?.availability === 2 ||
                      (product?.product?.availability === 1 && product?.product?.default_quantity === 0) ||
                      (product?.productAttribute && product.productAttribute.every(attr => attr.attribute_quantity === 0))) && (
                        <div className="pt-5">
                          <Button className="font-gotham font-medium py-2 px-2 text-xs w-[102px] stock-out">
                            Out of Stock
                          </Button>
                        </div>
                      )}

                    {product?.product?.availability === 3 && (
                      <div className="pt-5">
                        <Button className="font-gotham font-medium py-2 px-2 text-xs w-[102px]">
                          Up Coming
                        </Button>
                      </div>
                    )}

                    <div className="more-action pt-5">
                      <div className="flex flex-row items-center">
                        <span
                          onClick={() => {
                            return (
                              product?.product?.id &&
                              addWishList(product?.product?.id)
                            );
                          }}
                        >                          
                          <OutlineButton className="flex items-center font-gotham font-medium outline-hidden text-sm px-0 pr-2 md:text-base">
                            <span>
                              <AiOutlineHeart className="mr-1 text-2xl" />
                            </span>
                            Wishlist
                          </OutlineButton>
                        </span>
                        <span

                          onClick={() => {
                            if (
                              product?.productAttribute &&
                              product?.productAttribute.length > 0 &&
                              selectedAttributes.length < 1
                            ) {
                              toast.error("Please Select Variant");
                              return;
                            }
                            return (
                              product?.product?.id &&
                              addCompare({
                                product_id: product?.product?.id,
                                description:
                                  product?.product?.sort_description ?? "",
                                image: product?.product?.image,
                                title: product?.product?.title,
                                regular_price: Number(
                                  product?.product?.regular_price
                                ),
                                price:
                                  product.product.discount_price > 0
                                    ? Number(product?.product?.discount_price)
                                    : Number(product?.product?.regular_price),
                                quantity: 1,
                                rating: product.averageReview,
                                availability: product.product
                                  .availability as number,
                                attribute: selectedAttributes,
                              })
                            );
                          }}
                        >
                          <OutlineButton className="flex items-center font-gotham font-medium text-sm md:text-base mr-2 outline-hidden">
                            <span>
                              <BsArrowRepeat className="mr-1 text-2xl" />
                            </span>
                            Add to Compare
                          </OutlineButton>
                        </span>

                        <span className="share-item">
                          <OutlineButton className="flex items-center font-gotham font-medium text-sm md:text-base mr-2 outline-hidden">
                            <span>
                              <AiOutlineShareAlt className="mr-1 text-2xl" />
                            </span>
                            Share
                          </OutlineButton>
                          <SharePopUp
                            slug={`/product/${product?.product?.slug}`}
                          />
                        </span>
                      </div>
                    </div>

                    <div className="services py-3">
                      {keyPoints.map((service, index) => (
                        <Link href={service?.url} key={index}>
                          <div className="flex items-center mb-3">
                            <div className=" w-8">
                              <Image
                                className="w-full"
                                src={`${API_ROOT}/images/key-point/${service.image}`}
                                width={40}
                                height={40}
                                alt="service"
                              />
                            </div>
                            <div className="details ml-2">
                              <h3 className=" font-gotham font-medium text-bold text-base primary-text">
                                {service.title}
                              </h3>
                              <h4 className=" font-gotham font-medium text-bold text-xs black-text">
                                {service.subtitle}
                              </h4>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Link href='/Return-Refund'>
                      <OutlineButton className="flex items-center font-gotham font-medium text-xs py-1 pl-0 outline-hidden">
                        <span className="mr-2">
                          {/* <BsAwardFill /> */}
                          <FaAward className="award" />
                        </span>
                        7 Days Replacement & 12 Month Free Service
                      </OutlineButton>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="more-details">
            <div className="container">
              <div className="description">
                <div className="desc">
                  <Tabs>
                    <TabList className={`react-tabs__tab-list`}>
                      <Tab>Specification</Tab>
                      <Tab>Policy</Tab>
                      <Tab>Reviews</Tab>
                      <Tab>Video</Tab>
                      <Tab>Question</Tab>
                    </TabList>

                    <div className="tab-panel">
                      <TabPanel>
                        <div
                          className="specification ql-editor"
                          dangerouslySetInnerHTML={{
                            __html: product?.product?.description,
                          }}
                        />
                      </TabPanel>
                      <TabPanel>
                        <div
                          className="specification ql-editor"
                          dangerouslySetInnerHTML={{
                            __html: product?.product?.policy,
                          }}
                        />
                      </TabPanel>
                      <TabPanel>
                        <div className="review">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                              {product?.review?.length > 0 ? (
                                product?.review?.map((item, index) => (
                                  <ReviewCard key={index} review={item} />
                                ))
                              ) : (
                                <></>
                              )}
                            </div>
                            {/* Review Form */}
                            <div>
                              <h2 className=" font-gotham font-semibold text-lg black-text">
                                BE THE FIRST TO REVIEW
                              </h2>
                              <p className=" font-gotham font-normal text-xs black-text mt-4">
                                Your email address will not be published.
                                Required fields are marked *
                              </p>
                              <div className="flex items-center mt-9 mb-5">
                                <p className="font-gotham font-normal text-xs black-text">
                                  Your Rating *
                                </p>
                              </div>
                              <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="ml-2 mb-1">
                                  <Controller
                                    name="rating"
                                    control={control}
                                    defaultValue={0}
                                    rules={{
                                      required: "Rating is required",
                                      min: {
                                        value: 1,
                                        message: "Rating must be at least 1",
                                      },
                                    }}
                                    render={({ field }) => (
                                      <StarRatings
                                        rating={field.value}
                                        starRatedColor="#E30513"
                                        changeRating={(newRating) =>
                                          field.onChange(newRating)
                                        }
                                        numberOfStars={5}
                                        name={field.name}
                                        starDimension="15px"
                                        starSpacing="5px"
                                        starHoverColor="#e30514dc"
                                      />
                                    )}
                                  />
                                  {errors.rating && (
                                    <p className=" font-gotham text-xs warning">
                                      {errors.rating.message}
                                    </p>
                                  )}
                                </div>
                                <Controller
                                  name="name"
                                  control={control}
                                  defaultValue=""
                                  rules={{
                                    required: "Full Name is required",
                                    pattern: {
                                      value: /^[A-Za-z]+/,
                                      message:
                                        "Full Name must start with a letter",
                                    },
                                  }}
                                  render={({ field }) => (
                                    <FormGroup
                                      title="Full Name *"
                                      required
                                      value={field.value}
                                      onChange={(e) =>
                                        field.onChange(e.target.value)
                                      }
                                    />
                                  )}
                                />
                                {errors.name && (
                                  <p className=" font-gotham text-xs warning">
                                    {errors.name.message}
                                  </p>
                                )}
                                <Controller
                                  name="email"
                                  control={control}
                                  defaultValue=""
                                  rules={{
                                    required: "Email is required",
                                    pattern: {
                                      value:
                                        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
                                      message: "Invalid email address",
                                    },
                                  }}
                                  render={({ field }) => (
                                    <FormGroup
                                      title="Email *"
                                      type="email"
                                      required
                                      value={field.value}
                                      onChange={(e) =>
                                        field.onChange(e.target.value)
                                      }
                                    />
                                  )}
                                />
                                {errors.email && (
                                  <p className=" font-gotham text-xs warning">
                                    {errors.email.message}
                                  </p>
                                )}
                                <Controller
                                  name="comment"
                                  control={control}
                                  defaultValue=""
                                  rules={{
                                    required: "Review is required",
                                    pattern: {
                                      value: /^[A-Za-z]+/,
                                      message: "Review start with a letter",
                                    },
                                  }}
                                  render={({ field }) => (
                                    <TextAreaGroup
                                      title="Your Review *"
                                      required
                                      value={field.value}
                                      onChange={(e: any) =>
                                        field.onChange(e.target.value)
                                      }
                                    />
                                  )}
                                />
                                {errors.comment && (
                                  <p className=" font-gotham text-xs warning">
                                    {errors.comment.message}
                                  </p>
                                )}
                                <Button
                                  type="submit"
                                  className="my-4 px-10 py-1 font-gotham font-medium text-sm hover:bg-[#2456b5]"
                                >
                                  Submit
                                </Button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div className="video-wrapper">
                          {product.product.video_url && (
                            <>
                              {!isPlaying ? (
                                <div
                                  className="video-placeholder w-full h-[350px] md:h-[500px] lg:h-[700px]"
                                  onClick={handlePlay}
                                >
                                  {thumbnailUrl ? (
                                    <Image
                                      src={thumbnailUrl}
                                      alt="YouTube video thumbnail"
                                      height={500}
                                      width={500}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="no-thumbnail-placeholder w-full h-full flex items-center justify-center bg-gray-200">
                                      {/* Show a simple placeholder if no thumbnail */}
                                      <span>Click to play video</span>
                                    </div>
                                  )}
                                  <div className="play-button-overlay absolute inset-0 flex justify-center items-center">
                                    <button className="play-button text-white text-6xl">▶</button>
                                  </div>
                                </div>
                              ) : (
                                <iframe
                                  className="w-full h-[350px] md:h-[500px] lg:h-[700px]"
                                  height="700px"
                                  src={`${product.product.video_url}?autoplay=1`}
                                  title="YouTube video player"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  loading="lazy"
                                ></iframe>
                              )}
                            </>
                          )}
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <form onSubmit={handleSubmit(handleSubmitQuestion)}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Controller
                                name="number"
                                control={control}
                                rules={{
                                  required: "Your Number is required",
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message:
                                      "Your Number must contain only numbers",
                                  },
                                }}
                                render={({ field }) => (
                                  <>
                                    <FormGroup
                                      title="Your Number *"
                                      value={field.value}
                                      onChange={(e) =>
                                        field.onChange(e.target.value)
                                      }
                                      required
                                    />
                                    {errors.number && (
                                      <p className="font-gotham text-[11px] warning">
                                        {errors.number.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                              <Controller
                                name="question"
                                control={control}
                                rules={{
                                  required: "Ask Question is required",
                                  pattern: {
                                    value: /\S/,
                                    message: "Enter valid message",
                                  },
                                }}
                                render={({ field }) => (
                                  <TextAreaGroup
                                    title="Ask Question *"
                                    value={field.value}
                                    id="question"
                                    onChange={(e: any) =>
                                      field.onChange(e.target.value)
                                    }
                                    required
                                  />
                                )}
                              />

                              {errors.question && (
                                <p className="font-gotham text-[11px] warning">
                                  {errors.question.message}
                                </p>
                              )}
                              <Button
                                className=" font-gotham font-normal px-2 py-1 text-sm"
                                type="submit"
                              >
                                Submit
                              </Button>
                            </div>
                          </div>
                        </form>
                      </TabPanel>
                    </div>
                  </Tabs>
                </div>
              </div>

              <div className="related-products mt-12 pb-7">
                <Title title="Related Products" />
                <div className="grid md:grid-cols-5 grid-cols-2">
                  {product.relatedProduct.map((product, i) => (
                    <ProductCard
                      key={i}
                      url={product.slug}
                      image={product.image}
                      title={product.title}
                      regular_price={product.regular_price}
                      discount_price={product.discount_price}
                      isNew={product.is_new}
                      product_id={Number(product.id)}
                      sort_description={product.sort_description}
                      availability={product.availability}
                      quantity={product.default_quantity}
                      productAttribute={product.ProductAttribute}
                      camping_end_date={product.camping_end_date as string}
                      camping_start_date={product.camping_start_date as string}
                      camping_id={product.camping_id as number}
                      camping_name={product.camping_name as string}
                    />
                  ))}
                </div>
              </div>

              {adsBanner?.image && (
                <div className=" pb-24">
                  <Image
                    className="transition-all duration-100 hover:scale-[1.01]"
                    src={`${API_ROOT}/images/banner/${adsBanner?.image}`}
                    alt="ads"
                    width={1300}
                    height={500}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      {isEmi && (
        <EmiPopup
          handleEmi={handleEmi}
          price={
            product.product.discount_price > 0
              ? product.product.discount_price
              : product.product.regular_price
          }
        />
      )}
    </>
  );
};

export default PageDetails;

// Helper function to extract YouTube video ID
const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|watch\?vi=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};