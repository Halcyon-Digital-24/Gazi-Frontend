"use client";
import { FC, useCallback } from "react";
import ActionButton from "../action";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import "./index.scss";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface IProps {
  showTitle: string;
  handleShow?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  page: number;
  totalPage: any;
}

const ServerPagination: FC<IProps> = ({ totalPage = 2, page, showTitle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set(name, value);
  
      return params.toString();
    },
    [searchParams]
  );
  
  return (
    <div className="flex justify-between items-center mt-5 bottom-filter pagination px-1 md:px-0">
      <div>
        <ActionButton title={showTitle}>
          <ul>
            <li
              className="py-1 cursor-pointer action-item px-1 font-gotham text-xs font-normal"
              onClick={() => {
                router.push(pathname + "?" + createQueryString("limit", "16"));
              }}
            >
              16
            </li>
            <li
              className="py-1 cursor-pointer action-item px-1 font-gotham text-xs font-normal"
              onClick={() => {
                router.push(pathname + "?" + createQueryString("limit", "20"));
              }}
            >
              20
            </li>
            <li
              className="py-1 cursor-pointer action-item px-1 font-gotham text-xs font-normal"
              onClick={() => {
                router.push(pathname + "?" + createQueryString("limit", "24"));
              }}
            >
              24
            </li>
          </ul>
        </ActionButton>
      </div>

      <div className="flex items-center">
        {page > 1 && (
          <div
            className=" cursor-pointer p-1 mr-1"
            onClick={() => {
              router.push(
                pathname + "?" + createQueryString("page", String(page - 1))
              );
            }}
          >
            <IoMdArrowDropleft />
          </div>
        )}

        <div className=" font-gotham font-normal text-xs flex items-center">
          <div className="active flex items-center justify-center">{page}</div>
          <p>of {totalPage}</p>
        </div>
        {page < totalPage && (
          <div
            className=" cursor-pointer p-1 ml-1"
            onClick={() => {
              router.push(
                pathname + "?" + createQueryString("page", String(page + 1))
              );
            }}
          >
            <IoMdArrowDropright />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerPagination;
