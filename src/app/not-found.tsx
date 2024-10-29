import Link from "next/link";
import "./not-found.scss";
import Image from "next/image";

export default function Custom404() {
  return (
    <>
      <section className="white-bg dark:bg-gray-900 ">
        <div className="container flex items-center md:min-h-screen px-6 py-6 mx-auto">
          <div className="flex flex-col items-center max-w-sm mx-auto text-center">
            <Image
    
              className="w-[400px] h-[200px]"
              width={400}
              height={200}
              style={{ width: '400px', height: '200px' }}
              alt="not found"
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
