"use client";
import { API_ROOT } from "@/constant";
import { IProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ProductCard from "../card";
import { HomeApiResponse } from "@/types/home";

type IProps = {
  homeData: HomeApiResponse;
  adsbanner: string;
  bannerUrl: any;
};

const Featured: FC<IProps> = ({ homeData, adsbanner, bannerUrl }) => {
  return (
    <div>
      <section className="popular-product">
        <div className="container px-3 md:px-0">
          <Tabs>
            <TabList>
              <Tab className="font-gotham mr-3 ma:mr-9 md:text-base text-sm md:pr-5 pb-4 font-medium react-tabs__tab cursor-pointer">
                Top Sales
              </Tab>
              <Tab className="font-gotham mr-3 ma:mr-9 md:text-base text-sm md:pr-5 pb-4 font-medium react-tabs__tab cursor-pointer">
                New Arrivals
              </Tab>
              <Tab className="font-gotham mr-3 ma:mr-9 md:text-base text-sm md:pr-5 pb-4 font-medium react-tabs__tab cursor-pointer">
                Featured Products
              </Tab>
            </TabList>
            <div className="panel">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-6  md:col-span-5">
                  <TabPanel>
                    <div className="grid md:grid-cols-4 grid-cols-2 gap-1">
                      {homeData?.topSale?.map((product, i) => (
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
                          camping_start_date={
                            product.camping_start_date as string
                          }
                          camping_id={product.camping_id as number}
                          camping_name={product.camping_name as string}
                        />
                      ))}
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="grid md:grid-cols-4 grid-cols-2 gap-1">
                      {homeData?.newArrival?.map((product, i) => (
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
                          camping_start_date={
                            product.camping_start_date as string
                          }
                          camping_id={product.camping_id as number}
                          camping_name={product.camping_name as string}
                        />
                      ))}
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="grid md:grid-cols-4 grid-cols-2 gap-1">
                      {homeData?.featureProduct?.map((product, i) => (
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
                          camping_start_date={
                            product.camping_start_date as string
                          }
                          camping_id={product.camping_id as number}
                          camping_name={product.camping_name as string}
                        />
                      ))}
                    </div>
                  </TabPanel>
                </div>
                {adsbanner && (
                  <div className=" hidden md:block">
                    <Link href={bannerUrl ?? "/"}>
                      <Image
                        className=" w-full max-h-[852px] transition-all duration-100 hover:scale-[1.01]"
                        src={`${API_ROOT}/images/banner/${adsbanner}`}
                        width={100}
                        height={100}
                        quality={100}
                        alt="ads"
                      />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Featured;
