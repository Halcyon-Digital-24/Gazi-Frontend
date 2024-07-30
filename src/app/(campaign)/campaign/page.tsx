"use client";
import { useEffect, useState } from "react";
import { API_ROOT, API_URL } from "@/constant";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { ICampaign } from "@/types/campaign";
import Countdown, { CountdownRenderProps } from "react-countdown";
import Loader from "@/components/loader/loading";

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${API_URL}/frontend/campings`);
        const now = new Date().getTime();

        const sortedCampaigns = response.data.data.rows.sort((a: { end_date: string | number | Date; }, b: { end_date: string | number | Date; }) => {
          const endDateA = new Date(a.end_date).getTime();
          const endDateB = new Date(b.end_date).getTime();
        
          const isExpiredA = endDateA < now;
          const isExpiredB = endDateB < now;
        
          if (isExpiredA && !isExpiredB) {
            return 1; // Move expired campaign A to the end
          }
          if (!isExpiredA && isExpiredB) {
            return -1; // Move expired campaign B to the end
          }
        
          // If both are either expired or both are not expired, sort by end date
          return endDateA - endDateB;
        });
        
        setCampaigns(sortedCampaigns);
        // console.log(sortedCampaigns);
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        setIsLoading(false)
      }
    };

    fetchCampaigns();
  }, []);

  const getProductCount = (productIds: string | number) => {
    if (typeof productIds === "string") {
      return productIds.split(",").length;
    }
    return 0;
  };

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

  return (
    <div className="container mx-auto my-10 px-4 font-gotham">
      <h1 className="text-center text-2xl md:text-3xl font-bold my-5">Campaigns</h1>
      {
        isLoading && <Loader />
      }
      {campaigns?.length > 0 ? (

        campaigns?.map((campaign, index) => (
          <div key={index}>
            <Link href={`campaign/${campaign.id}`}>
              <div className="campaign-item md:mb-16 md:p-6 mx-1 md:mx-0 my-3 md:my-0 rounded-md shadow-sm bg-white">
                {campaign && (
                  <div className="category-banner mb-5">

                    <Image
                      className="w-full transition-all duration-200 hover:scale-[1.02] delay-100 h-auto rounded-lg"
                      src={`${API_ROOT}/images/camping/${campaign.image}`}
                      width={1000}
                      height={300}
                      alt={`campaign-banner-${index}`}
                    />

                  </div>
                )}
                <div className="campaign-details text-center">
                  {campaign?.name && <h1 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 text-blue-600">{campaign.name}</h1>}
                  {/* {campaign?.start_date && <p className="text-gray-600 mb-2">Start Date: {new Date(campaign.start_date).toLocaleDateString()}</p>} */}
                  {/* {campaign?.end_date && <p className="text-gray-600 mb-2">End Date: {new Date(campaign.end_date).toLocaleDateString()}</p>} */}
                  {campaign?.end_date && (
                    <div className="text-red-600 font-semibold mb-4">
                      <Countdown date={new Date(campaign.end_date)} renderer={renderer} />
                    </div>
                  )}
                  {/* {campaign.product_id && (
                <p className="text-gray-800 text-lg">
                  Number of Products: <span className="font-bold">{getProductCount(campaign.product_id)}</span>
                </p>
              )} */}
                </div>
              </div>
            </Link>
          </div>

        ))
      ) : (

        <p className="text-center my-10 text-2xl">No campaigns available</p>
      )}
    </div>
  );
};

export default CampaignPage;
