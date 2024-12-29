import { formatDate } from "@/components/dateformate";
import { API_ROOT, API_URL } from "@/constant";
import { IBlog, IResponseBlog } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineTwitter } from "react-icons/ai";
import { BiLogoFacebook, BiLogoLinkedin } from "react-icons/bi";
import { FiInstagram } from "react-icons/fi";
import "./page.scss";
import BlogComment from "@/components/blog-from";
// import { FaCircleUser } from "react-icons/fa6";

type Props = {
  params: {
    slug: string;
  };
};
type IResponse = {
  data: IBlog;
};

async function getBlog(id: string) {
  const res = await fetch(`${API_URL}/blogs/${id} `, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}

async function popularBlogs() {
  const url = `${API_URL}/frontend/blogs?limit=10&page=1`;
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  return data;
}
const BlogDetails = async ({ params: { slug } }: Props) => {
  const blogData: IResponse = await getBlog(slug);
  const popular: IResponseBlog = await popularBlogs();
  console.log("blog: ", blogData);
  

  return (
    <section className="blog-details mt-5">
      <div className="container px-2 md:px-0">
        <div className="grid grid-cols-6 gap-6">
          {
            <div className=" col-span-6 md:col-span-4">
              <div className="shadow">
                <Image
        
                  className="w-full"
                  src={`${API_ROOT}/images/blog/${blogData?.data?.image}`}
                  width={600}
                  height={600}
                  style={{ width: '100%', height: 'auto' }}
                  alt="blog"
                />
                <div className=" p-4">
                  <div className="border-area">
                    <h2 className="font-gotham font-bold text-base primary-text">
                      {blogData?.data?.title}
                    </h2>
                    <div className="flex justify-between py-2 social">
                      <div className="flex">
                        <div className="social-item flex justify-center items-center mr-1">
                          <Link
                            href={`https://web.facebook.com/sharer/sharer.php?u=https://gazi-frontend.vercel.app/blogs/Gas-Stove-Beboharer-Sothik-Niyomaboli`}
                            target="_blank"
                          >
                            <BiLogoFacebook />
                          </Link>
                        </div>
                        <div className="social-item flex justify-center items-center mr-1">
                          <Link href={"/"}>
                            <FiInstagram />
                          </Link>
                        </div>
                        <div className="social-item flex justify-center items-center mr-1">
                          <Link
                            href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                              `${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${blogData?.data?.slug}`
                            )}`}
                            target="_blank"
                          >
                            <BiLogoLinkedin />
                          </Link>
                        </div>
                        <div className="social-item flex justify-center items-center mr-1">
                          <Link
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                              `${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${blogData?.data?.slug}`
                            )}`}
                            target="_blank"
                          >
                            <AiOutlineTwitter />
                          </Link>
                        </div>
                      </div>
                      <div className="font-gotham font-normal text-xs primary-text">
                        {formatDate(blogData?.data?.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    className="font-gotham font-normal text-xs px-4 pb-4"
                    dangerouslySetInnerHTML={{
                      __html: blogData?.data?.description ?? "",
                    }}
                  />
                </div>
              </div>
              {/*  <div className="shadow mt-5 p-4">
                <h3 className=" font-gotham font-normal text-base primary-text mb-3">
                  Comments
                </h3>
                <div className="flex mt-2  items-center">
                  <div className="mr-2">
                    <FaCircleUser />
                  </div>
                  <div>
                    <h4 className="font-gotham font-medium text-sm">
                      Md Shekh Talha
                    </h4>
                    <p className="font-gotham font-normal text-xs">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Vero, illum!
                    </p>
                  </div>
                </div>
              </div> */}
              <div className="shadow mt-5 p-4">
                <h3 className=" font-gotham font-normal text-base primary-text mb-3">
                  Write a comment
                </h3>
                <div>
                  {/*  <form>
                    <div className="grid grid-cols-2 gap-4">
                      <FormGroup title="Name" className="mb-2 " required />
                      <FormGroup title="Email" className=" mb-2" required />
                    </div>
                    <TextAreaGroup title="Your Comment" required />

                    <Button
                      type="submit"
                      className="px-3 py-1 font-gotham font-normal text-sm mt-2"
                    >
                      Summit
                    </Button>
                  </form> */}
                  <BlogComment blogId={blogData?.data?.id as number} />
                </div>
              </div>
            </div>
          }
          <div className=" col-span-6 md:col-span-2">
            <h2 className="font-gotham font-normal text-xl  primary-text">
              Popular Blogs
            </h2>
            <div className="mt-3 more-blog">
              {popular?.data?.rows.map((blog, index) => (
                <div key={index} className="flex mb-3 p-2 shadow">
                  <div className="w-[25%] mr-2">
                    <Image
            
                      className="w-full"
                      src={`${API_ROOT}/images/blog/${blog.image}`}
                      width={100}
                      height={100}
                      style={{ width: '100%', height: '100%' }}
                      alt="blog"
                    />
                  </div>
                  <div className="text w-3/4">
                    <Link href={`/blogs/${blog.id}`}>
                      <h4 className=" font-gotham  font-normal text-base primary-text">
                        {blog.title}
                      </h4>
                    </Link>

                    <div className="flex justify-between items-center">
                      <p className="font-gotham font-normal text-xs primary-text">
                        Publish in
                      </p>
                      <p className="font-gotham font-normal text-xs mt-2 primary-text">
                        {formatDate(blog?.created_at)}
                      </p>
                    </div>
                    <Link
                      className="font-gotham font-normal text-xs mt-2 primary-text"
                      href={`/blogs/${blog?.id}`}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
