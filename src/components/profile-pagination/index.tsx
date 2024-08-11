import React, { FC } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

type IProps = {
  incrementPage: () => void;
  decrementPage: () => void;
  totalPage: number;
  currentPage: number;
};

const ProfilePagination: FC<IProps> = ({
  currentPage,
  incrementPage,
  decrementPage,
  totalPage,
}) => {
  return (
    <div className="flex justify-between items-center">
      {currentPage <= 1 ? (
        <p aria-disabled="true">
          <FaLongArrowAltLeft className="opacity-60" />
        </p>
      ) : (
        <p className="cursor-pointer" onClick={decrementPage}>
          <FaLongArrowAltLeft />
        </p>
      )}
      <span>
        Page {currentPage} of {totalPage}
      </span>
      {totalPage <= currentPage ? (
        <p aria-disabled="true">
          <FaArrowRightLong className="opacity-60" />
        </p>
      ) : (
        <p className="cursor-pointer" onClick={incrementPage}>
          <FaArrowRightLong />
        </p>
      )}
    </div>
  );
};

export default ProfilePagination;
