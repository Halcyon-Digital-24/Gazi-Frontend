import React from "react";
import "./page.scss";
import Image from "next/image";

const Maintenance = () => {
  return (
    <div className=" md:py-40 py-12 text-center">
      <Image
        className="maintenance-loader"
        src={"/assets/images/icon/gear-rotation.svg"}
        width={800}
        height={800}
        style={{ width: '100%', height: 'auto' }}
        alt="loader"
      />

      <h2 className=" font-gotham font-medium text-lg primary-text">
        Site is under maintenance
      </h2>
      <p className=" font-gotham text-sm mt-2">
        We&apos;re working hard to improve the user experience. Stay turned
      </p>
    </div>
  );
};

export default Maintenance;
