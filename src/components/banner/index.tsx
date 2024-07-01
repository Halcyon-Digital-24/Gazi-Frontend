'use client';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import './index.scss';
import Link from 'next/link';
import { IBanner } from '@/types/banner';
import { API_ROOT } from '@/constant';

const settings = {
  dots: true,
  infinite: true,
  arrows: false,
  speed: 400,
  autoplay: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
};

type IProps = {
  banners: IBanner[];
};
const Banner = ({ banners }: IProps) => {

  const [data, setData] = useState<IBanner[]>([])

  useEffect(() => {
    if (banners?.length)
      setData(banners?.filter((item) => item?.is_visible))
  }, [])

  return (
    <>
      {
        data?.length ?
          <div className="banner">
            <Slider {...settings}>
              {data?.map((banner, index) => (
                <div className="outline-none" key={index}>
                  <Link href={ banner.url}>
                    <Image
                      src={`${API_ROOT}/images/banner/${banner.image}`}
                      width={2400}
                      height={500}
                      alt="banner"
                      priority={true}
                      className='h-auto'
                    />
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
          : ''
      }

    </>

  );
};

export default Banner;
