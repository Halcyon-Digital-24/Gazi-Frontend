"use client";
import React, { useEffect, useState } from "react";
import "./page.scss";
import { API_URL } from "@/constant";
import "react-quill/dist/quill.snow.css";
import "../not-found.scss";
import Image from "next/image";
import Link from "next/link";
import CircleLoader from "@/components/css-loader";

type Props = {
  params: {
    slug: string;
  };
};
type IPage = {
  title: string;
  content: string;
};
async function getPages(slug: string) {
  const res = await fetch(`${API_URL}/frontend/pages/${slug} `);
  const data = await res.json();
  return data;
}

const CustomPage = ({ params: { slug } }: Props) => {
  const [pageData, setPageData] = useState<IPage>({} as IPage);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const data = await getPages(slug);
        setPageData(data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return <CircleLoader />;
  }
  if (!pageData?.content) {
    return (
      <>
        <section className="white-bg dark:bg-gray-900 ">
          <div className="container flex items-center md:min-h-screen px-6 py-6 mx-auto">
            <div className="flex flex-col items-center max-w-sm mx-auto text-center">
              <Image
                className="w-[400px] h-[200px]"
                width={200}
                height={200}
                alt="404"
                src={"/assets/images/404/error.png"}
                property="true"
              />
              <Link className="px-2 py-1 primary-bg text-[#fff]" href={"/"}>
                Back to Homepage
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }
  return (
    <section className="custom">
      <div className="container">
        <h3 className="mb-4 font-gotham font-semibold">{pageData?.title}</h3>
        {/* <div>
          <Image
            className="w-full"
            src="/assets/images/banner/BG.png"
            alt="custom"
            width={400}
            height={400}
          />
        </div> */}
        <div
          className=" font-gotham mt-5 ql-editor"
          dangerouslySetInnerHTML={{ __html: pageData?.content }}
        />
      </div>
    </section>
  );
};

export default CustomPage;
