"use client";
import { IBlog } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { formatDate } from "../dateformate";
import { API_ROOT } from "@/constant";

interface IProps {
  blog: IBlog;
}

const BlogSideCard: FC<IProps> = ({ blog }) => {
  return (
    <div className="flex mb-3 p-2 shadow">
      <div className="w-[25%] mr-2">
        <Image
          className="w-full"
          src={`${API_ROOT}/images/blog/${blog.image}`}
          width={100}
          height={100}
          style={{ width: '100%', height: 'auto' }}
          alt="blog"
        />
      </div>
      <div className="text w-3/4">
        <Link href={`/blogs/${blog.slug}`}>
          <h4 className=" font-gotham  font-normal text-base black-text">
            {blog.title}
          </h4>
        </Link>

        <div className="flex justify-between items-center">
          <p className="font-gotham font-normal text-xs black-text">
            Publish in
          </p>
          <p className="font-gotham font-normal text-xs mt-2 black-text">
            {formatDate(blog.created_at)}
          </p>
        </div>
        <Link
          className="font-gotham font-normal text-xs mt-2 primary-text"
          href={`/blogs/${blog.slug}`}
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogSideCard;
