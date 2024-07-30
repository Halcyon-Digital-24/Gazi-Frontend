import Banner from "@/components/banner";
import { API_ROOT, API_URL } from "@/constant";
import { HomeApiResponse } from "@/types/home";
import { IProduct, IProductResponse } from "@/types/product";
import { IService } from "@/types/service";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { BsArrowRightShort } from "react-icons/bs";
import "./page.scss";
const ServiceCard = dynamic(() => import("@/components/service-card"));
const Featured = dynamic(() => import("@/components/featured"));
const ExploreCard = dynamic(() => import("@/components/explore"));
const ProductCard = dynamic(() => import("@/components/card"));
const Title = dynamic(() => import("@/components/title"));
const VideoCard = dynamic(() => import("@/components/video-card"));

async function getData() {
  const res = await fetch(`${API_URL}/home-page`, {
    cache: "no-store",

  });
  return res.json();
}

async function categoryProduct(category_slug: string) {
  const res = await fetch(
    `${API_URL}/frontend/products?page=1&limit=5&category=${category_slug}`,
    {
      cache: "no-store",

    }
  );
  return res.json();
}

async function serviceItems() {
  try {
    const response = await fetch(`${API_URL}/frontend/keypoints/home?limit=4`, {
      cache: "no-store",

    });

    if (!response.ok) {
      throw new Error("Failed to fetch service items");
    }

    const data = await response.json();

    return data?.data?.rows;
  } catch (error) {
    console.log(error);
  }
}

async function categoryAdBanner(slug: string) {
  const res = await fetch(`${API_URL}/banners/${slug}`, {
    cache: "no-store",

  });
  return res.json();
}

export default async function Home() {
  const homeData: HomeApiResponse = await getData();
  const services: IService[] = await serviceItems();
  const gasStoveProducts: IProductResponse = await categoryProduct(
    homeData?.homePage?.category_one
  );
  const kitchenHoodProducts: IProductResponse = await categoryProduct(
    homeData?.homePage?.category_two
  );
  const digitalScaleProducts: IProductResponse = await categoryProduct(
    homeData?.homePage?.category_three
  );
  const addBanner = await categoryAdBanner("home");
  const verticalBanner = await categoryAdBanner("home-v");
  return (
    <>
      <main>
        <section>
          <Banner banners={homeData.banner} />
        </section>

        <section className="service">
          <div className="container px-2 md:px-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {services?.map((service, i) => (
                <ServiceCard key={i} service={service} />
              ))}
            </div>
          </div>
        </section>

        <section className="explore">
          <div className="container">
            <h2 className="mb-6 uppercase text-center font-gotham text-[18px] md:text-xl font-bold ">
              EXPLORE HOME APPLIANCES
            </h2>
            <div className="flex flex-wrap justify-center  ">
              {homeData?.category
                ?.sort((a, b) => (a.order_id || 0) - (b.order_id || 0))
                .map((category, i) => (
                  <ExploreCard
                    className="md:w-1/6 w-1/3 text-center p-2"
                    key={i}
                    item={category}
                  />
                ))}
            </div>
          </div>
        </section>
        <Featured
          homeData={homeData}
          adsbanner={verticalBanner?.data[0]?.image}
          bannerUrl={verticalBanner?.data[0]?.url}
        />
        <section className="promotion">
          <Link href={homeData?.homePage?.special_product_link ?? "/"}>
            <Image
              src={`${API_ROOT}/images/home-page/${homeData?.homePage?.special_product_photo}`}
              alt="promotion banner"
              width={1800}
              height={500}
              quality={100}
              className='h-auto'
            />
          </Link>
        </section>
        <section className="category-products">
          <div className="container px-2 md:px-0">
            <div className="mb-12">
              <Title
                title={homeData?.homePage?.category_one_title}
                href={`/category/filter?category=${homeData?.homePage?.category_one}`}
              />
              <div className="grid md:grid-cols-5 grid-cols-2 gap-1">
                {gasStoveProducts?.data?.rows.map(
                  (product: IProduct, i: number) => (
                    <ProductCard
                      key={i}
                      url={product.slug}
                      image={product.image}
                      title={product.title}
                      regular_price={product.regular_price}
                      discount_price={product.discount_price}
                      product_id={Number(product.id)}
                      sort_description={product.sort_description}
                      availability={product.availability}
                      quantity={product.default_quantity}
                      productAttribute={product["product-attributes"]}
                      camping_end_date={product.camping_end_date as string}
                      camping_start_date={product.camping_start_date as string}
                      camping_id={product.camping_id as number}
                      camping_name={product.camping_name as string}
                    />
                  )
                )}
              </div>
            </div>
            <div className="mb-12">
              <Title
                title={homeData?.homePage?.category_two_title}
                href={`/category/filter?category=${homeData?.homePage?.category_two}`}
              />
              <div className="grid md:grid-cols-5 grid-cols-2 gap-1">
                {kitchenHoodProducts?.data?.rows.map((product, i) => (
                  <ProductCard
                    key={i}
                    url={product.slug}
                    image={product.image}
                    title={product.title}
                    regular_price={product.regular_price}
                    discount_price={product.discount_price}
                    product_id={Number(product.id)}
                    sort_description={product.sort_description}
                    availability={product.availability}
                    quantity={product.default_quantity}
                    productAttribute={product["product-attributes"]}
                    camping_end_date={product.camping_end_date as string}
                    camping_start_date={product.camping_start_date as string}
                    camping_id={product.camping_id as number}
                    camping_name={product.camping_name as string}
                  />
                ))}
              </div>
            </div>
            <div>
              <Title
                title={homeData?.homePage?.category_three_title}
                href={`/category/filter?category=${homeData?.homePage?.category_three}`}
              />
              <div className="grid md:grid-cols-5 grid-cols-2 gap-1">
                {digitalScaleProducts?.data?.rows.map((product, i) => (
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
                    productAttribute={product["product-attributes"]}
                    camping_end_date={product.camping_end_date as string}
                    camping_start_date={product.camping_start_date as string}
                    camping_id={product.camping_id as number}
                    camping_name={product.camping_name as string}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="review-video">
          <div className="container ">
            <Link href={addBanner?.data[0]?.url ?? "/"}>
              <Image
                className=" transition-all duration-100 hover:scale-[1.01] h-auto"
                src={`${API_ROOT}/images/banner/${addBanner?.data[0]?.image}`}
                alt="ads"
                width={1300}
                height={500}
                quality={100}
              />
            </Link>
          </div>
          {
            homeData?.video?.length ?
              <><div className="container px-2 md:px-0">
                <h2 className=" py-12 uppercase text-center font-gotham text-xl font-medium">
                  PRODUCT REVIEWS & UNBOXING VIDEOS
                </h2>
                <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                  {homeData?.video?.map((video, index) => (
                    <VideoCard key={index} url={video.url} title={video.title} />
                  ))}
                </div>
              </div>
                <div className="text-center mt-7">
                  <Link
                    className=" font-gotham font-normal text-sm  more-btn"
                    href={"/videos"}
                  >
                    More Videos
                    <BsArrowRightShort className="inline text-xl font-bold" />
                  </Link>
                </div>

              </>
              : ''
          }

        </section>
      </main>
    </>
  );
}
