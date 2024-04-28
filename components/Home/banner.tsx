import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import SwiperClass from "swiper/types/swiper-class";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { observeElementIntersection } from "@/lib/utils/util";

SwiperCore.use([Navigation, Autoplay, Pagination]);
const spaceBetween = 0;
const slidesPerView = 1;

type CardType = {
  subTitle: string;
  title: string;
  desc: string;
  link: string
}
const Card = ({
                subTitle,
                title,
                desc,
                link
              }: CardType) => {
  const t = useTranslations("banner");
  useEffect(() => {
    observeElementIntersection(".home-banner .animate", (target) => {
      if (window.innerWidth <= 768) return;
      if (target.classList.contains("banner-box")) {
        target.classList.remove("opacity-0");
        target.classList.add("animate__fadeIn");
      } else {
        target.classList.add("animate__fadeInLeft");
      }
    }, (target) => {
      if (window.innerWidth <= 768) return;
      if (target.classList.contains("banner-box")) {
        target.classList.remove("animate__fadeIn");
        target.classList.add("opacity-0");
      } else {
        target.classList.remove("animate__fadeInLeft");
      }
    });
  }, []);
  return <div className="absolute inset-0 bg-transparent max-md:relative ">
    <div className="container w-full h-full c-flex">
      <div className="w-full home-banner">
        <div
          className="space-y-4 max-md:shadow-none px-[40px] max-md:py-[25px] max-md:px-[20px] w-[520px] lg:w-[700px] md:w-[520px] max-md:w-full max-md:mx-auto
           py-[45px]  animate animate__animated banner-box animate__delay-300">
          <p
            className="text-main font-bold  subtitle animate__animated animate animate__delay-400">{t(subTitle)}</p>
          <h2
            className="Constantia text-5xl py-1.5 title animate__animated animate animate__delay-600 max-md:font-bold max-md:text-2xl">{t(title)}</h2>
          <p
            className="text-[14px] desc animate__animated animate animate__delay-800">{t(desc)}</p>
          <Link href={link}
                className="link mt-4 block px-5 max-md:text-sm py-2 bg-main w-fit text-white font-bold animate hover:shadow-lg
                duration-300 animate__animated animate__delay-1000 rounded-full">{t("Read_More")}</Link>
        </div>
      </div>
    </div>
  </div>;
};
const Banner1 = () => {
  const cardData = {
    subTitle: "6c9e2417c198de435d8a9e00cdf7ad310367",
    title: "3e168801a7a6da4a01e8a86ea5b8b7ceabf6",
    desc: "dccf22302c98bb4eee19e54b84333288cd57",
    link: "/product"
  };
  return <div
    className="relative w-full h-full bg-white b-flex max-md:flex-col">
    <img src={"/image/home/banner 1.png"} className="object-cover w-full h-full" alt="" />
    <Card {...cardData} />
  </div>;
};
const Banner2 = () => {
  const cardData = {
    subTitle: "6c9e2417c198de435d8a9e00cdf7ad310367",
    title: "3e168801a7a6da4a01e8a86ea5b8b7ceabf6",
    desc: "Lefeng",
    link: "/product"
  };
  return <div
    className="relative w-full h-full bg-white b-flex max-md:flex-col">
    <img src={"/image/home/banner2.png"} className="object-cover w-full h-full" alt="" />
    <Card {...cardData} />
  </div>;
};
export default function HomeBanner() {
  const [swiperExample, setSwiperExample] = useState<SwiperClass>();
  return <Swiper
    onSwiper={setSwiperExample}
    className=" group max-md:h-fit bg-white home-banner border-b-[1px]"
    spaceBetween={spaceBetween}
    slidesPerView={slidesPerView}
    navigation={true}
    loop={true}
    pagination={{
      clickable: true,
      bulletActiveClass: "swiper-pagination-bullet-active !w-[12px] !h-[12px] !bg-white",
      bulletClass: "swiper-pagination-bullet home-banner-bullet"
    }}
    autoplay={
      {
        delay: 8000,
        disableOnInteraction: true
      }
    }
  >
    <SwiperSlide>
      <Banner1 />
    </SwiperSlide>
    <SwiperSlide>
      <Banner2 />
    </SwiperSlide>
  </Swiper>;
}