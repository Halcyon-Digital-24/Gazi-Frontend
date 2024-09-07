import { API_ROOT, API_URL } from "@/constant";
import { HomeApiResponse } from "@/types/home";
import { IMenu } from "@/types/menu";
import Image from "next/image";
import Link from "next/link";
import { BsEnvelopeFill, BsHeadphones } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import "./index.scss";
import Subscriber from "../subscribe";

type IProps = {
  globalData: HomeApiResponse;
};

async function getFooterOneData(slug: string) {
  const res = await fetch(`${API_URL}/menus/${slug}`);

  if (!res.ok) {
    throw new Error("Failed to fetch Footer data");
  }

  const data = await res.json();
  return data?.data;
}

const Footer = async ({ globalData }: IProps) => {

  const footerOneData: IMenu[] = await getFooterOneData("customer_service");
  const footerTwoData: IMenu[] = await getFooterOneData("home_appliance");

  return (
    <footer>
      <div className="container px-2 md:px-0">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-12">
          <div className="basic-info">
            <Image
              className=" mb-5"
              src={`${API_ROOT}/images/setting/${globalData?.setting?.logo}`}
              width={154}
              height={80}
              alt="gazi group logo"
            />
            <div className="flex mb-3">
              <span className="mr-4">
                <FaLocationDot className=" w-5 h-5 primary-text mt-1" />
              </span>
              <p className=" font-gotham font-medium text-sm primary-text ">
                {globalData?.setting?.address}
              </p>
            </div>
            <a className="flex mb-3" href={"tel:" + globalData?.setting?.contact_number}>
              <span className="mr-4">
                <BsHeadphones className=" w-5 h-5 primary-text mt-1" />
              </span>
              <p className=" font-gotham font-medium text-sm primary-text">
                {globalData?.setting?.contact_number}
              </p>
            </a>
            <a className="flex items-start " href={"mailto: " + globalData?.setting?.contact_email}>
              <span className="mr-4">
                <BsEnvelopeFill className=" w-5 h-5 primary-text mt-1" />
              </span>
              <p className=" font-gotham font-medium text-sm primary-text">
                {globalData?.setting?.contact_email}
              </p>
            </a>
          </div>
          <div>
            <div className="w-[60%] md:mx-auto">
              <h3 className="font-gotham font-[600] text-base primary-text mb-4">
                Customer Service
              </h3>
              <ul className=" mx-auto">
                {footerOneData?.length > 0 ? (
                  footerOneData?.map((item, index) => (
                    <li
                      className="font-gotham font-medium text-sm primary-text mb-1"
                      key={index}
                    >
                      <Link className="link-item" href={item.slug}>
                        {item.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <></>
                )}
              </ul>
            </div>
          </div>

          <div>
            <div className="w-[60%] md:mx-auto">
              <h3 className="font-gotham font-[600] text-base primary-text mb-4">
                Gazi Home Appliancee
              </h3>
              <ul className="mx-auto">
                {footerTwoData?.length > 0 ? (
                  footerTwoData?.map((item, index) => (
                    <li
                      className="font-gotham font-medium  text-sm primary-text mb-1"
                      key={index}
                    >
                      <Link className="link-item" href={item.slug}>
                        {item.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <></>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div>
            <p className=" font-gotham font-medium text-sm primary-text mb-2 ">
              Download our Mobile Apps
            </p>
            <div className="flex">
              <Link
                href={globalData?.setting?.play_store_url as string}
                target="_blank"
              >
                <Image
                  className="mr-2 download-apps"
                  src="/assets/images/service/playstore.png"
                  alt="play-store"
                  width={500}
                  height={45}
                />
              </Link>
              <Link
                href={globalData?.setting?.app_store_url as string}
                target="_blank"
              >
                <Image
                  className="download-apps"
                  src="/assets/images/service/appstore.png"
                  alt="app-store"
                  width={500}
                  height={45}
                />
              </Link>
            </div>
          </div>
          <div>
            <p className=" font-gotham font-medium text-sm primary-text mb-2">
              Follow Us
            </p>
            <div className="flex">
              {globalData?.setting?.facebook_url && (
                <Link href={globalData.setting.facebook_url} target="_blank">
                  <Image
                    className=" rounded w-6 h-6 mx-1"
                    src="/assets/images/icon/facebook.png"
                    width={20}
                    height={20}
                    alt="social-icon"
                  />
                </Link>
              )}
              {globalData?.setting?.instagram_url && (
                <Link href={globalData.setting.instagram_url} target="_blank">
                  <Image
                    className=" rounded w-6 h-6 mx-1"
                    src="/assets/images/icon/instagram.png"
                    width={20}
                    height={20}
                    alt="social-icon"
                  />
                </Link>
              )}
              {globalData?.setting?.linkedIn_url && (
                <Link href={globalData.setting.linkedIn_url} target="_blank">
                  <Image
                    className=" rounded w-6 h-6 mx-1"
                    src="/assets/images/icon/linkedin.png"
                    width={20}
                    height={20}
                    alt="social-icon"
                  />
                </Link>
              )}
              {globalData?.setting?.youtube_url && (
                <Link href={globalData?.setting?.youtube_url} target="_blank">
                  <Image
                    className=" rounded w-6 h-6 mx-1"
                    src="/assets/images/icon/youtube.png"
                    width={20}
                    height={20}
                    alt="social-icon"
                  />
                </Link>
              )}
            </div>
          </div>
          <Subscriber />
        </div>
      </div>
      <div className=" mt-10 py-2 primary-bg">
        <div className="container px-2 md:px-0">
          <div className="flex justify-between items-center gap-1 md:gap-2">
            <div className=" ">
              <h4 className=" font-gotham font-light text-[10px] md:text-xs white-text">
               {globalData?.setting?.footer_copywrite||'© 2022-2023 | Gazi Home Appliance - A Concern of Gazi Group'} 
              </h4>
            </div>
            <div className=" ">
              <Image
                className=" h-5 md:h-12 w-full "
                src={"/assets/images/footer/payment-01.png"}
                width={400}
                height={50}
                alt="payment"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
