import React, { useEffect, useState } from "react";
import { GqlProductBySlugNodeInterface } from "@/lib/types/gql/product/product-by-slug.type";
import { ProductZoom } from "@/components/Product/product-zoom";
import Skeleton from "react-loading-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Placeholder } from "@/components/Placeholder";
import SwiperCore, { Navigation } from "swiper";
import SwiperClass from "swiper/types/swiper-class";
import { getDiscount } from "@/lib/utils/util";
import Badge from "@/components/Badge";
import { useProductVariableStore } from "@/lib/store/product-variable.store";
import ProductVideo from "@/components/Product/product-video";
import SupplierDetails from "@/components/Product/supplierDetails";

SwiperCore.use([Navigation]);
type Props = {
  product: GqlProductBySlugNodeInterface | null
}
const imageWh = 450;
const spaceBetween = 20;
const slidesPerView = 4;

function ImageGallery({ product }: Props) {
  const [active, setActive] = useState(0);
  const [mainImage, setMainImage] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [swiperExample, setSwiperExample] = useState<SwiperClass>();
  const [discount, setDiscount] = useState<number | string>(0);
  const { currentProduct } = useProductVariableStore();
  const [metaData, setMetaData] = useState<any>();
  const [playVideo, setPlayVideo] = useState<boolean>(false);

  const changeProductImages = (product: GqlProductBySlugNodeInterface) => {
    if (product === null) {
      setImages([]);
      setMainImage("");
      setActive(0);
      return;
    }
    if (product?.image?.sourceUrl) {
      setMainImage(product?.image?.sourceUrl);
      if (product?.galleryImages?.nodes.length) {
        setImages([product?.image?.sourceUrl, ...product?.galleryImages?.nodes?.map(i => i.sourceUrl)]);
      } else {
        setImages([product?.image?.sourceUrl]);
      }
    }
    product && setDiscount(getDiscount(product.price, product.regularPrice));
  };

  useEffect(() => {
    if (product) {
      changeProductImages(product);
      setActive(0);
      setMetaData(() => {
        const metaData = product?.metaData || [];
        if (metaData && metaData.length) {
          return metaData.filter(i => {
            if (i.key === "woodmart_wc_video_gallery" && i.value && typeof i.value === "string") {
              const value = JSON.parse(i.value);
              let valueObj: any;
              Object.keys(value).find(k => {
                if (value[k].upload_video_url || value[k].vimeo_url || value[k].youtube_url) {
                  valueObj = value[k];
                  return true;
                }
              });
              i.value = valueObj;
              return i;
            }
          })[0];
        }
        return undefined;
      });
    }
  }, [product]);
  useEffect(() => {
    if (currentProduct?.image?.sourceUrl) {
      setMainImage(currentProduct.image.sourceUrl);
      setImages(old => {
        const newImages = [...old];
        newImages[0] = currentProduct?.image?.sourceUrl;
        return newImages;
      });
      setActive(0);
    } else if (product) {
      changeProductImages(product);
    }
  }, [currentProduct]);
  const handlePrevOrNext = (type: "prev" | "next") => {
    if (type === "prev") {
      setActive((value) => {
        if (value === 0) return value;
        setMainImage(images[value - 1]);
        swiperExample?.slidePrev();
        return value - 1;
      });
    } else {
      setActive((value) => {
        if (value + 1 > images.length - 1) return value;
        setMainImage(images[value + 1]);
        if ((value + 1) > slidesPerView - 1) {
          swiperExample?.slideNext();
        }
        return value + 1;
      });
    }
  };

  const setActiveImgIndex = (index: number) => {
    setActive(val => {
      if (images.length > slidesPerView) {
        const prev = document.querySelector(".button-prev") as HTMLElement;
        const next = document.querySelector(".button-next") as HTMLElement;
        index > val ? next?.click() : prev?.click();
      }
      return index;
    });
  };

  const changeVideoUrl = (type: string): string => {
    return {
      "youtube": metaData.value.youtube_url,
      "mp4": metaData.value.upload_video_url,
      "vimeo": metaData.value.vimeo_url
    }[type];
  };

  useEffect(() => {
    if (active !== 0) {
      setPlayVideo(false);
    }
  }, [active]);

  return <div className="w-full flex items-center flex-col select-none">
    <div className="w-full c-flex relative">
      {
        mainImage && images.length > 1 && <div onClick={() => {
          handlePrevOrNext("prev");
        }} className="max-md:absolute max-md:hidden md:mr-2 z-[1] left-[-46px] w-[40px] h-[40px] flex justify-center
                              items-center top-1/2 cursor-pointer mt-[-21px] max-md:left-1 ri-arrow-left-s-line ri-2x bg-white rounded-full shadow-md" />
      }
      <div style={{
        maxWidth: `${imageWh}px`,
        maxHeight: `${imageWh}px`
      }} className="relative w-fit h-fit">
        {
          mainImage ? <div className="border-[1px] w-full h-full group">
              <ProductZoom src={mainImage} imageWidth={imageWh} imageHeight={imageWh}
                           setActiveImgIndex={setActiveImgIndex}
                           quality={100} imgList={images} fit="contain" />
              {
                !!discount && <Badge className="absolute z-[3] right-1 top-1">
                  {discount}
                </Badge>
              }
              {
                active === 0 && metaData &&
                <div className="absolute z-[3] left-1/2 top-1/2 cursor-pointer translate-x-[-50%] translate-y-[-50%]"
                     onClick={() => setPlayVideo(old => {
                       return !old;
                     })}>
                  <i
                    className={`${playVideo ? "ri-pause-circle-fill hidden group-hover:block" : "ri-play-circle-fill"} ri-4x text-white`}></i>
                </div>
              }
              {
                metaData && <ProductVideo
                  className={`absolute ${(active === 0 && playVideo) ? "" : "hidden"} z-[2] left-1/2 top-1/2 cursor-pointer translate-x-[-50%] translate-y-[-50%]`}
                  type={metaData.value!.video_type as string}
                  url={changeVideoUrl(metaData.value!.video_type as string)} play={playVideo} />
              }
            </div> :
            <Skeleton height={imageWh} width={imageWh} />
        }
      </div>
      {
        mainImage && images.length > 1 && <div onClick={() => {
          handlePrevOrNext("next");
        }}
                                               className="max-md:absolute max-md:hidden md:ml-2 right-[-46px] max-md:right-1 w-[40px] h-[40px] flex justify-center items-center top-1/2 cursor-pointer mt-[-21px]  ri-arrow-right-s-line ri-2x bg-white rounded-full shadow-md" />
      }
    </div>
    <div style={{
      maxWidth: `${imageWh}px`,
      height: `${imageWh / 4}px`
    }} className="mt-2 w-full relative b-flex">
      {images.length ?
        <>
          {
            images.length > slidesPerView && <>
              <div
                onClick={
                  () => {
                    handlePrevOrNext("prev");
                  }
                }
                className={`button-prev cursor-pointer max-lg:left-0 z-[2] lg:z-[1] ri-arrow-left-s-line ri-3x text-main absolute left-[-50px]`}
              />
              <div
                onClick={
                  () => {
                    handlePrevOrNext("next");
                  }
                }
                className={`button-next cursor-pointer max-lg:right-0 z-[2] lg:z-[1] ri-arrow-right-s-line ri-3x text-main absolute right-[-50px]`}
              />
            </>
          }
          <Swiper
            onSwiper={setSwiperExample}
            className="w-full"
            spaceBetween={spaceBetween}
            slidesPerView={slidesPerView}
            // navigation={
            //   {
            //     nextEl: ".button-next",
            //     prevEl: ".button-prev"
            //   }
            // }
          >

            {
              images?.map((image: any, index: number) => (
                <SwiperSlide key={index}>
                  <div
                    className={`w-fit h-fit cursor-pointer border-2 c-flex ${
                      active === index ? "border-main" : "border-themeSecondary200"
                    }`}
                    onClick={() => {
                      setMainImage(image);
                      setActive(index);
                    }}
                  >
                    <div className="hidden relative sm:flex sm:justify-center sm:items-center">
                      <Placeholder
                        quality={100}
                        src={image}
                        imageWidth={100}
                        imageHeight={100}
                        alt={""}
                        fit="contain"
                      />
                      {
                        index === 0 && metaData &&
                        <div
                          className="absolute z-[1] left-1/2 top-1/2 cursor-pointer translate-x-[-50%] translate-y-[-50%]">
                          <i className="ri-play-circle-fill ri-2x text-white"></i>
                        </div>
                      }
                    </div>
                    <div className="sm:hidden relative flex">
                      <Placeholder
                        quality={100}
                        src={image}
                        imageWidth={100}
                        imageHeight={100}
                        alt={""}
                        fit="contain"
                      />
                      {
                        index === 0 && metaData &&
                        <div
                          className="absolute z-[1] left-1/2 top-1/2 cursor-pointer translate-x-[-50%] translate-y-[-50%]">
                          <i className="ri-play-circle-fill ri-2x text-white"></i>
                        </div>
                      }
                    </div>
                  </div>
                </SwiperSlide>))
            }
          </Swiper>
        </>
        :
        [1, 2, 3, 4].map((_, index) => <Skeleton key={index} height={80} width={80} />)
      }
    </div>
    <SupplierDetails />
  </div>;
}

export default React.memo(ImageGallery);
