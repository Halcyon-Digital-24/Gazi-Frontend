"use client";
import dynamic from "next/dynamic";
const ActionButton = dynamic(() => import("@/components/action"));
const CategoryFilter = dynamic(() => import("@/components/category-filter"));
const FilterBox = dynamic(() => import("@/components/filterbox"));
const ListCard = dynamic(() => import("@/components/list-card"));
const Pagination = dynamic(() => import("@/components/pagination"));
import { API_ROOT, API_URL } from "@/constant";
import { IBanner } from "@/types/banner";
import { ICategoryData, ICategoryResponse } from "@/types/category";
import { IProduct, IProductResponse } from "@/types/product";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AiOutlineBars } from "react-icons/ai";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { PiDotsNineBold } from "react-icons/pi";
import { RiArrowDropRightLine } from "react-icons/ri";
const ReactSlider = dynamic(() => import("react-slider"));
// import ReactSlider from "react-slider";
import "./page.scss";
import { useAppSelector } from "@/redux/hooks";
import { useDebounce } from "use-debounce";
const ProductCard = dynamic(() => import("@/components/card"));

function Category() {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const { title, slug } = useAppSelector((state) => state.category);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [page, setPage] = useState(1);
  const [isRow, setIsRow] = useState<boolean>(true);
  const [showTitle, setShowTitle] = useState<string>("Show 12");
  const [sortBy, setSortBy] = useState<string>("Sort by");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [limit, setLimit] = useState<number | string>(12);
  const [adsBanner, setAdsBanner] = useState<IBanner>({} as IBanner);
  const [çategories, setCategories] = useState<string[]>([]);
  const [availabilities, setAvailabilities] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mainCategory, setMainCategory] = useState<
    ICategoryData[]
  >([]);
  const [categoryFilterItems, setCategoryFilterItems] = useState<
    ICategoryData[]
  >([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [count, setCount] = useState(0);

  const handleShow = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const clickedElement = event.target as HTMLLIElement;
    const innerText = clickedElement.innerText;
    setShowTitle(`Show ${innerText}`);
    setLimit(innerText);
  };

  const handleSortBy = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const clickedElement = event.target as HTMLLIElement;
    const innerText = clickedElement.innerText;
    setSortBy(innerText);
  };

  const incrementPage = () => {
    setPage(page + 1);
  };

  const decrementPage = () => {
    if (page !== 1) {
      setPage(page - 1);
    }
  };

  const [debouncedPriceRange] = useDebounce(priceRange, 300);


  async function categoryAdBanner() {
    try {
      const data = await axios.get(
        `${API_URL}/banners/${searchParams.get("category")?.trim()}`
      );

      setAdsBanner(data.data?.data[0]);
    } catch (error) {
      console.log("category ads banner" + error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ICategoryResponse>(
          `${API_URL}/categories?page=1&limit=100`
        );
        if (response.status == 200) {
          ds(response.data?.data?.rows)
          setMainCategory(response.data?.data?.rows);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    categoryAdBanner();
    ds(mainCategory)
  }, [searchParams]);
  useEffect(() => {
    setPage(1);
  }, [searchParams.get("category")]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams.get("category"), page]);

  const getParentCategory = (list: any, text: string) => {
    for (let i = 0; i < list?.length; i++) {
      if (list[i].slug?.trim() == text?.trim() && (list[i].parent_category === "0" ||
        list[i].parent_category === null ||
        list[i].parent_category === "")) {


        return list[i].slug;
      }
      else if (list[i].slug?.trim() == text?.trim()) {

        for (let j = 0; j < list?.length; j++) {
          if (list[i].parent_category?.trim() == list[j].slug?.trim() &&
            (list[j].parent_category === "0" ||
              list[j].parent_category === null ||
              list[j].parent_category === "")
          ) {
            return list[j].slug;

          }
          else if (list[i].parent_category?.trim() == list[j].slug?.trim()) {
            for (let k = 0; k < list?.length; k++) {
              if (list[j].parent_category?.trim() == list[k].slug?.trim() &&
                (list[k].parent_category === "0" ||
                  list[k].parent_category === null ||
                  list[k].parent_category === "")
              ) {
                return list[k].slug;

              }
            }
          }
        }

        // getParentCategory(list, list[i].parent_category)
      }
    }
    return ''
  }

  const ds = (data: any) => {
    setCategoryFilterItems([])
    let paramCatagory = searchParams.get("category")?.trim() || '';
    let temp = JSON.parse(JSON.stringify(data))
    let category: any[] = [];
    let finalCategory: any[] = [];
    let parentCategory: string = getParentCategory(temp, paramCatagory) || ''

    if (parentCategory != '') {
      for (let i = 0; i < temp?.length; i++) {

      }
      for (let i = 0; i < temp?.length; i++) {
        if (parentCategory?.trim() == temp[i]?.parent_category?.trim() || (parentCategory?.trim() == temp[i]?.slug?.trim())) category.push(temp[i]?.slug)
      }
      for (let i = 0; i < category?.length; i++) {
        if (category[i])
          for (let j = 0; j < temp?.length; j++) {
            if (category[i]?.trim() == temp[j]?.parent_category?.trim() || (category[i]?.trim() == temp[j]?.slug?.trim())) finalCategory.push(temp[j]?.slug)

          }
      }
      for (let i = 0; i < finalCategory?.length; i++) {
        for (let j = 0; j < temp?.length; j++) {
          if (finalCategory[i]?.trim() == temp[j].slug?.trim()) {
            temp[j].isActive = true;

          }
        }
      }
    }
    finalCategory = finalCategory.filter((item, i, ar) => ar.indexOf(item) === i);
    setCategoryFilterItems([...temp])
    setActiveCategories(finalCategory)
  }

  const fetchData = async () => {
    setIsLoading(true);
    const search: string = searchParams.get("search")?.trim() || "";
    const mainCategory: string = searchParams.get("category")?.trim() || "";
    const availability: string =
      (availabilities.length > 0 && availabilities.join(",")) || "";
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
    const tempCategories: string[] =
      çategories.length > 0 ? [...çategories] : [mainCategory, ...çategories];
    const category: string =
      (tempCategories.length > 0 && tempCategories.join(",")) || "";
    try {
      const response = await axios.get<any>(
        `${API_URL}/frontend/products?limit=${limit}&page=${page}` +
        `${category !== "" ? "&category=" + category : ""}` +
        `${search !== "" ? "&search=" + search : ""}` +
        `${debouncedPriceRange[0] > 0 || debouncedPriceRange[1] < 200000
          ? "&min_price=" + debouncedPriceRange[0]
          : ""
        }` +
        `${debouncedPriceRange[0] > 0 || debouncedPriceRange[1] < 200000
          ? "&max_price=" + debouncedPriceRange[1]
          : ""
        }` +
        `${sort_by !== "" ? "&sort_by=" + sort_by : ""}` +
        `${availability !== "" ? "&availability=" + availability : ""}`
      );
      setProducts(
        response?.data?.data ? response.data?.data?.rows : response?.data?.rows
      );
      setCount(
        response.data?.data ? response.data?.data?.count : response?.data?.count
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
  }, [
    limit,
    page,
    çategories,
    searchParams,
    debouncedPriceRange,
    sortBy,
    availabilities,
  ]);

  const handleMultipleCategory = (title: string, removeUnselected: boolean) => {
    if (removeUnselected) {
      setCategories((prevState) =>
        prevState?.find((item) => item === title)
          ? prevState.filter((item) => item !== title)
          : [...prevState]
      );
      return;
    }
    setCategories((prevState) =>
      prevState?.find((item) => item === title)
        ? prevState.filter((item) => item !== title)
        : [...prevState, title]
    );
  };

  const handleAvailability = (event: any) => {
    setAvailabilities((prevState) =>
      prevState?.find((item) => item === event.target.value)
        ? prevState.filter((item) => item !== event.target.value)
        : [...prevState, event.target.value]
    );
  };

  return (

    // <Suspense key={searchParams.get("category")} fallback={<p>commming...</p>}>

    <main>
      <section className=" hidden md:block">
        <div className="container">
          <div className="flex items-center font-gotham font-normal text-sm mt-3 mb-3">
            <Link href={"/"}>Home</Link>
            {searchParams.get("category")?.trim() !== "" &&
              çategories?.length == 0 ? (
              <>
                <RiArrowDropRightLine className=" text-xl" />
                <Link href={`/category/filter?category=${slug}`}>
                  {" "}
                  {title}{" "}
                </Link>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </section>
      <section className="pb-12">
        <div className="container">
          {
            mainCategory?.length ?
              <div className="flex justify-between">
                {
                  categoryFilterItems?.length ?
                    <div className=" hidden md:block md:w-[250px]">
                      <FilterBox title="Category">
                        <CategoryFilter
                          activeCategories={activeCategories}
                          categoryFilterItems={categoryFilterItems}
                          handleMultipleCategory={handleMultipleCategory}
                        />
                      </FilterBox>

                      <FilterBox title="Availability">
                        <div className="flex mb-2">
                          <input
                            type="checkbox"
                            className="accent-[#E30513]"
                            name="stock"
                            id="stock"
                            value={1}
                            onChange={handleAvailability}
                          />
                          <label
                            className="ml-2 font-gotham font-normal text-sm primary-hover transition-all"
                            htmlFor="stock"
                          >
                            In Stock
                          </label>
                        </div>
                        <div className="flex mb-2">
                          <input
                            type="checkbox"
                            className="accent-[#E30513]"
                            name="stock-out"
                            id="stockout"
                            value={2}
                            onChange={handleAvailability}
                          />
                          <label
                            className="ml-2 font-gotham font-normal text-sm primary-hover"
                            htmlFor="stockout"
                          >
                            Out of Stock
                          </label>
                        </div>
                        <div className="flex">
                          <input
                            type="checkbox"
                            className="accent-[#E30513]"
                            name="instock"
                            id="upcoming"
                            value={3}
                            onChange={handleAvailability}
                          />
                          <label
                            className="ml-2 font-gotham font-normal text-sm primary-hover"
                            htmlFor="upcoming"
                          >
                            Up Coming
                          </label>
                        </div>
                      </FilterBox>
                      <FilterBox title="Price">
                        <div className="double-slider-container">
                          <ReactSlider
                            className="horizontal-slider"
                            thumbClassName="example-thumb"
                            trackClassName="example-track"
                            value={priceRange}
                            min={0}
                            max={60000}
                            step={10} // Adjust step size as needed
                            minDistance={500}
                            onChange={(value) => setPriceRange(value as [number, number])}
                          />
                        </div>
                        <div className="flex w-full justify-between mt-2">
                          <input
                            className="price-input font-gotham font-medium text-xs"
                            type="number"
                            min={0}
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseFloat(e.target.value), priceRange[1]])}
                          />
                          <input
                            className="price-input font-gotham font-medium text-xs"
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                          />
                        </div>
                      </FilterBox>
                    </div>
                    : ''
                }

                <div className="md:w-[925px] w-full">
                  {adsBanner?.image && (
                    <div className="category-banner mb-5">
                      <div className="">
                        <Link href={adsBanner.url}>
                          <Image
                  
                            className="w-full  transition-all duration-100 hover:scale-[1.01] h-auto "
                            src={`${API_ROOT}/images/banner/${adsBanner?.image}`}
                            width={1000}
                            height={300}
                            style={{ width: '100%', height: 'auto' }}
                            loading="lazy"
                            alt="gazi category-banner"
                          />
                        </Link>
                      </div>
                    </div>
                  )}

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

                  {!isLoading ? (
                    <div className="filter-products mx-1 md:mx-0">
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
                    <div className="loading-container py-5 text-center">
                      <p className=" font-gotham text-sm">Loading...</p>
                    </div>
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
              </div>
              :
              <>
                <div className="py-5 text-center col-span-4">
                  <p className=" font-gotham black-text text-sm text-center font-normal">
                    Loading...
                  </p>
                </div>
              </>
          }

        </div>
      </section>
    </main>
    // </Suspense>
  );
}

export default Category;
