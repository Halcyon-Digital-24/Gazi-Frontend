import dynamic from "next/dynamic";
const VideoCard = dynamic(() => import("@/components/video-card"));
import "./page.scss";
import Link from "next/link";
import { RiArrowDropRightLine } from "react-icons/ri";
import Image from "next/image";
import { API_ROOT, API_URL } from "@/constant";
import { IVideoApiResponse } from "@/types/video";
import { IBanner } from "@/types/banner";
import ServerPagination from "@/components/pagination/pagination";

async function adBanner() {
  try {
    const response = await fetch(`${API_URL}/banners/video`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch banner video");
    }

    const data = await response.json();
    return data?.data[0];
  } catch (error) {
    console.log("video ads banner" + error);
  }
}

async function getVideos(page: number = 1, limit: number = 12) {
  const url = `${API_URL}/frontend/videos?limit=${limit}&page=${page} `;
  const res = await fetch(url, {
    cache: "no-store",


  });
  const data = await res.json();
  return data;
}

async function Videos({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === "string" ? Number(searchParams.limit) : 12;
  const adsBanner: IBanner = await adBanner();
  const videos: IVideoApiResponse = await getVideos(page, limit);


  return (
    <main>
      <section>
        <div className="container">
          <div className="md:flex items-center font-gotham font-normal text-sm mt-3 mb-3 hidden ">
            <Link href={"/"}>Home</Link>
            <RiArrowDropRightLine className=" text-xl" />
            <Link href={"/videos"}> Videos </Link>
          </div>
        </div>
      </section>

      <section className="md:mt-8 md:mb-5 mt-3 mb-2">
        {adsBanner?.image && (
          <div className="container">
            <Link href={"/"}>
              <Image
                className="w-full"
                src={`${API_ROOT}/images/banner/${adsBanner.image}`}
                width={1200}
                height={340}
                loading="lazy"
                style={{ width: '100%', height: 'auto' }}
                alt="ads"
              />
            </Link>
          </div>
        )}
      </section>

      <div className="videos-section">
        <section>
          <div className="container px-2 md:px-0">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              {videos?.data?.rows.map((video, index) => (
                <VideoCard key={index} url={video.url} title={video.title} />
              ))}
            </div>
          </div>
        </section>
        {
          videos?.data?.rows?.length ?
            <div className="container">
              <ServerPagination
                showTitle={`Show ${limit}`}
                page={page}
                totalPage={Math.ceil((videos.data?.count || 1) / limit)}
              />
            </div> : null
        }

      </div>
    </main>
  );
}

export default Videos;
