"use client";
import { useEffect, useState } from "react";
import { API_ROOT, API_URL } from "@/constant";
import axios from "axios";
import Image from "next/image";
import Countdown, { CountdownRenderProps } from "react-countdown";
import { ICampaign } from "@/types/campaign";
import { IProduct } from "@/types/product";
import Loader from "@/components/loader/loading";
import ListCard from "@/components/list-card";
import ProductCard from "@/components/card";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import ActionButton from "@/components/action";
import { AiOutlineBars } from "react-icons/ai";
import { PiDotsNineBold } from "react-icons/pi";
import Pagination from "@/components/pagination";

type Props = {
  params: {
    slug: number | string;
  };
};

const CampaignDetailsPage = ({ params: { slug } }: Props) => {
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRow, setIsRow] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("Sort by");
  const [showTitle, setShowTitle] = useState<string>("Show 12");
  const [limit, setLimit] = useState<number | string>(12);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/frontend/campings`);
        const campaignData = response.data.data.rows;

        if (slug) {
          const filteredCampaignData = campaignData.find((campaign: ICampaign) => campaign.id == slug);
          setCampaign(filteredCampaignData || null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCampaignDetails();
    }
  }, [slug]);

  // useEffect(() => {
  //   const fetchCampaignProducts = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await axios.get(`${API_URL}/frontend/campings/${slug}?page=1&limit=10`);
  //       const campaignProductData = response.data.products;
  //       // console.log(campaignProductData);

  //       setProducts(campaignProductData);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching campaign details:", error);
  //       setIsLoading(false);
  //     }
  //   };

  //   if (slug) {
  //     fetchCampaignProducts();
  //   }
  // }, [slug]);

  const fetchData = async () => {
    setIsLoading(true);

    let sort_by: string = "";
    switch (sortBy) {
      case "Newest":
        sort_by = "newest";
        break;
      case "Oldest":
        sort_by = "oldest";
        break;
      case "Price low to high":
        sort_by = "low";
        break;
      case "Price high to low":
        sort_by = "high";
        break;
    }

    try {
      const response = await axios.get<any>(
        `${API_URL}/frontend/campings/${slug}?limit=${limit}&page=${page}` + `${sort_by !== "" ? "&sort_by=" + sort_by : ""}`
      );
      // console.log(response.data);

      setProducts(
        response?.data.products
      );
      setCount(
        response.data.totalProducts
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    loadData();
  }, [limit, page, sortBy, slug]);


  const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      return <span>Campaign Ended</span>;
    } else {
      return (
        <div className="countdown flex justify-center gap-2">
          <div className="countdown-item flex flex-col items-center">
            <span className="font-bold md:text-2xl text-xl">{days}</span>
            <span>Days</span>
          </div>
          <div className="countdown-item flex flex-col items-center">
            <span className="font-bold md:text-2xl text-xl">{hours}</span>
            <span>Hours</span>
          </div>
          <div className="countdown-item flex flex-col items-center">
            <span className="font-bold md:text-2xl text-xl">{minutes}</span>
            <span>Minutes</span>
          </div>
          <div className="countdown-item flex flex-col items-center">
            <span className="font-bold md:text-2xl text-xl">{seconds}</span>
            <span>Seconds</span>
          </div>
        </div>
      );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!campaign) {
    return <p className="my-20 text-center">Campaign not found</p>;
  }
  const handleSortBy = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const clickedElement = event.target as HTMLLIElement;
    const innerText = clickedElement.innerText;
    setSortBy(innerText);
  };

  const handleShow = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const clickedElement = event.target as HTMLLIElement;
    const innerText = clickedElement.innerText;
    setShowTitle(`Show ${innerText}`);
    setLimit(innerText);
  };

  const incrementPage = () => {
    setPage(page + 1);
  };

  const decrementPage = () => {
    if (page !== 1) {
      setPage(page - 1);
    }
  };
  return (
    <div className="container mx-auto my-5 px-4 font-gotham">
      {campaign && (
        <div className="campaign-details">
          <div className="category-banner mb-5">
            <Image
              className="w-full transition-all duration-200 hover:scale-[1.02] delay-100 h-auto rounded-md"
              src={`${API_ROOT}/images/camping/${campaign.image}`}
              width={1000}
              height={300}
              alt={`campaign-banner-${campaign.id}`}
            />
          </div>
          <div className="campaign-details text-center">
            {campaign.name && <h1 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 text-blue-600">{campaign.name}</h1>}
            {campaign.end_date && (
              <div className="text-red-600 font-semibold mb-4">
                <Countdown date={new Date(campaign.end_date)} renderer={renderer} />
              </div>
            )}
          </div>

          {/* top bar for category, sorting etc  */}
          <div className="flex justify-between items-center filter-bar py-2 px-5 mb-5 shadow-sm">
            <div className=" flex items-center">
              <span
                className={`${isRow ? "active" : null} p-1 mr-2 `}
                onClick={() => setIsRow(true)}
              >
                <PiDotsNineBold className="text-xl icon" />
              </span>
              <span
                className={`${!isRow ? "active" : null} p-1 `}
                onClick={() => setIsRow(false)}
              >
                <AiOutlineBars className="text-xl icon" />
              </span>
            </div>
            <div className="action flex items-center">
              <div >
                <ActionButton title={sortBy}>
                  <ul>
                    <li
                      className="py-1 cursor-pointer action-item px-1 font-gotham text-xs font-normal"
                      onClick={handleSortBy}
                    >
                      Newest
                    </li>
                    <li
                      className="py-1 cursor-pointer action-item px-1 font-gotham text-xs font-normal"
                      onClick={handleSortBy}
                    >
                      Oldest
                    </li>
                    <li
                      className="py-1 cursor-pointer action-item px-1 font-gotham text-xs font-normal"
                      onClick={handleSortBy}
                    >
                      Price low to high
                    </li>
                    <li
                      className="py-1 cursor-pointer action-item px-1 font-gotham text-xs font-normal"
                      onClick={handleSortBy}
                    >
                      Price high to low
                    </li>
                  </ul>
                </ActionButton>
              </div>

              <div className="ml-2">
                <ActionButton title={showTitle}>
                  <ul>
                    <li
                      className="py-1 cursor-pointer action-item px-1 font-gotham text-xs font-normal"
                      onClick={handleShow}
                    >
                      12
                    </li>
                    <li
                      className="py-1 cursor-pointer action-item px-1 font-gotham text-xs font-normal"
                      onClick={handleShow}
                    >
                      16
                    </li>
                    <li
                      className="py-1 cursor-pointer action-item px-1 font-gotham text-xs font-normal"
                      onClick={handleShow}
                    >
                      20
                    </li>
                    <li
                      className="py-1 cursor-pointer action-item px-1 font-gotham text-xs font-normal"
                      onClick={handleShow}
                    >
                      24
                    </li>
                  </ul>
                </ActionButton>
              </div>
              <div className="flex items-center ml-2">
                {page > 1 && (
                  <div
                    className=" cursor-pointer p-1"
                    onClick={decrementPage}
                  >
                    <IoMdArrowDropleft />
                  </div>
                )}

                <div className=" font-gotham font-normal text-xs flex items-center">
                  <div className="active w-[30px] h-[26px] mr-[6px] flex items-center justify-center ">
                    {page}
                  </div>
                  <p>of {Math.ceil(count / Number(limit))}</p>
                </div>
                {page < Math.ceil(count / Number(limit)) && (
                  <div
                    className=" cursor-pointer p-1"
                    onClick={incrementPage}
                  >
                    <IoMdArrowDropright />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* products */}
          {!isLoading ? (
            <div className="filter-products px-2 md:px-0 mx-1 md:mx-0">
              {isRow ? (
                <div className="grid md:grid-cols-4 grid-cols-2 gap-1 mb-5">
                  {products?.length > 0 ? (
                    products?.map((product, i) => (
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
                        camping_end_date={
                          product.camping_end_date as string
                        }
                        camping_start_date={
                          product.camping_start_date as string
                        }
                       camping_id={product.camping_id as number}
                       camping_name={product.camping_name as string}
                      />
                    ))
                  ) : (
                    <>
                      <div className="py-5 text-center col-span-4">
                        <p className=" font-gotham black-text text-sm text-center font-normal">
                          Product not found
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 mb-5">
                  {products?.length > 0 ? (
                    products?.map((product, i) => (
                      <ListCard key={i} product={product} />
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Loader />
          )}
          <Pagination
            page={page}
            incrementPage={incrementPage}
            decrementPage={decrementPage}
            showTitle={showTitle}
            handleShow={handleShow}
            totalPage={Math.ceil(count / Number(limit))}
          />
        </div>
      )}
    </div>
  );
};

export default CampaignDetailsPage;
