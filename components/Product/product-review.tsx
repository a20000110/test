import { useEffect, useState } from "react";
import { useReviews } from "@/lib/hooks/useReviews";
import { WooGetResponse } from "@/lib/Woocommerce/WooCommerceRApi";
import { ProductReviewInterface } from "@/lib/types/rest-api/product/review.type";
import { BodyText } from "@/components/BodyText";
import Rating from "react-rating";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button";
import { RingLoader } from "react-spinners";
import { useLocale, useTranslations } from "next-intl";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { toast } from "react-toastify";

type ReviewProps = WooGetResponse<ProductReviewInterface[]>

type FormValues = {
  name: string;
  email: string;
  message: string;
};

function ReviewShow({ reviews }: { reviews?: ReviewProps }) {
  const t = useTranslations();
  return <div className="c-flex">
    {
      reviews?.result.length ? <ul className="w-full space-y-3">
        {
          reviews?.result?.map((r: ProductReviewInterface) => {
            return <li key={r.id} className="p-4 bg-white rounded-2xl w-full">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-[48px] h-[48px]  relative rounded-full overflow-hidden bg-[#f3f3f3] c-flex">
                  {
                    r.reviewer_avatar_urls?.["48"] ?
                      <img src={r.reviewer_avatar_urls["48"]} alt="" />
                      : <i className="ri-user-line ri-2x text-[#a7a7a9]" />
                  }
                </div>
                <div className="flex-col flex items-start">
                  <BodyText intent="bold" size="md"
                            className="mb-0.5">{r.reviewer || "user"}</BodyText>
                  {/* @ts-ignore */}
                  <Rating
                    readonly
                    initialRating={r.rating}
                    emptySymbol={<i className="ri-star-fill text-themeSecondary300 h-4 w-4" />}
                    fullSymbol={<i className="ri-star-fill text-themeWarning500 h-4 w-4" />}
                  />
                </div>
              </div>
              <BodyText size="lg" className="text-themeSecondary500" innerHTML={r.review}></BodyText>
            </li>;
          })
        }
      </ul> : reviews === undefined ? <RingLoader color="#000" /> :
        <BodyText size="xl" className="text-blue-500 py-16"
                  intent="bold">{t("product.1b95b319726f444a6918e1267ed3c813cff6")}</BodyText>
    }
  </div>;
}

function ReviewForm({ rating = 0, productId, getReviews }: {
  rating: number,
  productId: number,
  getReviews: () => void
}) {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>();

  const [loading, setLoading] = useState(false);
  const onSubmit = handleSubmit((data: FormValues) => {
    if (rating === 0) {
      return toast(t("message.ec8085a0ad056b4fb66819950d843b3b39c9"), { type: "error" });
    }
    const addData = {
      review: data?.message,
      reviewer: data?.name,
      reviewer_email: data?.email,
      rating: rating,
      product_id: productId
    };
    setLoading(true);
    fetch("/api/products/post-review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(addData)
    }).then(response => {
      if (!response.ok) {
        toast(response.statusText, { type: "error" });
        return;
      }
      toast(t("message.22c2a854620c8f4ce7983d03d85ae7d11fb6"), {
        type: "success"
      });
      getReviews();
    }).finally(() => {
      setLoading(false);
    });
  });
  return <form className="mt-8" onSubmit={onSubmit}>
    <div className="flex flex-col md:flex-row items-center gap-5">
      <input
        className={`w-full px-5 py-3 text-base outline-none bg-white border rounded placeholder:text-themeSecondary400 ${
          errors.name && "border-red-500"
        }`}
        placeholder={t("common.Name")}
        type="text"
        {...register("name", {
          required: true
        })}
      />
      <input
        className={`w-full px-5 py-3 text-base outline-none bg-white border rounded placeholder:text-themeSecondary400 ${
          errors.email && "border-red-500"
        }`}
        placeholder={t("common.Email")}
        type="email"
        {...register("email", {
          required: true
        })}
      />
    </div>
    <textarea
      rows={8}
      cols={50}
      placeholder={t("message.925e0efa5d9d3b4ea9484f342a00d95c0ea2")}
      className={`w-full px-5 py-3 text-base outline-none bg-white border rounded placeholder:text-themeSecondary400 mt-5 ${
        errors.message && "border-red-500"
      }`}
      {...register("message", {
        required: true
      })}
    />
    <Button
      size="xl"
      className={`flex gap-4 items-center justify-center w-full mt-7 ${loading ? "bg-themeSecondary800" : ""}`}
    >
      {loading && <RingLoader color="#fff" />}
      {loading ? t("message.7f9e518a7a1d1e4bc3e8990bed1d9be4d404") + "..." : t("product.c5802b247693094859b8557054ce78b3fab0")}
    </Button>
  </form>;
}

export default function ProductReview({ id, setReviewTotal }: { id: number, setReviewTotal: (total: number) => void }) {
  const [reviews, setReviews] = useState<ReviewProps>();
  const [rating, setRating] = useState(0);
  const locale = useLocale();
  const t = useTranslations();
  const fetchData = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const data = await useReviews(id);
    const review = data?.result?.length ? await translateStaticProps(data.result, ["review", "reviewer"], "auto", locale) : data.result;
    setReviews({
      ...data,
      result: review
    });
    setReviewTotal(data.total);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return <>
    <div className={`w-full ${reviews?.result?.length ? "h-[34rem]" : ""} overflow-y-auto scrollBar`}>
      <ReviewShow reviews={reviews} />
    </div>
    <div className="w-full">
      <div>
        <BodyText intent="semibold" size="md" className="text-themeSecondary800 mt-6">
          {t("product.0b7c302851a3214d17e85fd7648ed90194e5")}
        </BodyText>
        <div className="flex gap-1 mt-3">
          {/* @ts-ignore */}
          <Rating
            onClick={setRating}
            initialRating={rating}
            emptySymbol={<i className="ri-star-fill text-themeSecondary300 h-4 w-4" />}
            fullSymbol={<i className="ri-star-fill text-themeWarning500 h-4 w-4" />}
          />
        </div>
        <ReviewForm rating={rating} productId={id} getReviews={fetchData} />
      </div>
    </div>
  </>;
}
