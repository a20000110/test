import { useEffect, useState } from "react";
import { BodyText } from "@/components/BodyText";
import styled from "@emotion/styled";
import parse from "html-react-parser";
import {
  GqlProductAttributeNodeInterface,
  GqlProductBySlugNodeInterface
} from "@/lib/types/gql/product/product-by-slug.type";
import Skeleton from "react-loading-skeleton";
import ProductReview from "@/components/Product/product-review";
import { handlerInnerHtml } from "@/lib/utils/util";
import { useLocale, useTranslations } from "next-intl";
import { translateStaticProps } from "@/lib/utils/translate-util";

const getAttributeLang = async (attributes: GqlProductAttributeNodeInterface[], locale: string | undefined) => {
  if (!locale) return attributes;
  return await translateStaticProps(attributes, ["name"], "auto", locale);
};

export default function Describe(props: GqlProductBySlugNodeInterface) {
  const t = useTranslations();
  const locale = useLocale();
  const [active, setActive] = useState(0);
  const [attributes, setAttributes] = useState<GqlProductAttributeNodeInterface[]>();
  const [reviewTotal, setReviewTotal] = useState<number>(0);
  useEffect(() => {
    if (props?.attributes?.nodes.length) {
      const nodes = JSON.parse(JSON.stringify(props.attributes.nodes));
      const attr = [
        ...nodes
        , {
          name: t("product.Width"),
          value: "Width",
          options: [props?.width ? `${props.width}cm` : ""]
        }, {
          name: t("product.Height"),
          value: "Height",
          options: [props?.height ? `${props.height}cm` : ""]
        }, {
          name: t("product.Weight"),
          value: "Weight",
          options: [props?.weight ? `${props.weight}kg` : ""]
        }, {
          name: t("product.Length"),
          value: "Length",
          options: [props?.length ? `${props.length}cm` : ""]
        }];
      getAttributeLang(attr, locale).then(res => {
        setAttributes(res);
      });
    }
  }, [props.attributes]);

  return <div className="rounded-2xl py-12 md:grid md:grid-cols-2">
    <div className="mt-6">
      {
        !!Object.keys(props).length ? <>
            <section
              className={`text-themeSecondary500 py-5 bg-white`}>
              <h2 className="mb-5 font-bold text-3xl text-black">{t("product.Additional_Information")}</h2>
              {attributes?.map((attr, index: number) => (
                <div
                  className={`py-4 pl-5 lg:pl-7 flex flex-col gap-1 md:flex-row ${
                    index % 2 === 0 ? "bg-themeSecondary100" : " bg-white"
                  }`}
                  key={index}
                >
                  <BodyText size="md" className=" text-themeSecondary800 w-full md:w-1/4">
                    {attr.name}
                  </BodyText>
                  <div key={index} className=" w-full">
                    <div
                      className="text-themeSecondary500 s-flex flex-wrap gap-x-2 w-full">
                      {
                        !!attr.options.length && attr.options.map((opt, optIndex) => {
                          return <div key={optIndex} className="flex gap-2">
                            <BodyText size="md"
                                      className=" text-themeSecondary500 w-full">
                              {opt}
                            </BodyText>
                          </div>;
                        })
                      }
                    </div>
                  </div>
                </div>
              ))}
            </section>
            <h2 className="mb-5 font-bold text-3xl mt-32 text-black">{t("product.Description")}</h2>
            <section
              className={`text-themeSecondary500 max-w-4xl mx-auto`}
            >
              <Element>
                {props.description &&
                  parse(handlerInnerHtml(props.description), {
                    replace: (domNode: any) => {
                      if (domNode.name === "img") {
                        return (
                          <img src={domNode.attribs.src} alt={domNode.attribs.alt} className="w-full"
                               width={domNode.attribs.width} height={domNode.attribs.height} />
                        );
                      }
                    }
                  })}
              </Element>
            </section>
            <section
              className={`flex flex-col gap-12 mt-20 border-t py-20`}>
              <ProductReview id={props.databaseId} setReviewTotal={setReviewTotal} />
            </section>
          </> :
          <Skeleton width={"100%"} height={150}></Skeleton>
      }
    </div>
    <div></div>
  </div>;
}

const Element = styled.div`
  p {
    font-size: 18px;
    color: #52525b;
    padding: 10px 0;
  }

  h1 {
    color: #18181b;
    font-weight: 700;
    font-size: 28px;
    padding: 4px 0;
  }

  h2 {
    color: #18181b;
    font-weight: 700;
    font-size: 24px;
    padding: 4px 0;
  }

  h3 {
    color: #18181b;
    font-weight: 700;
    font-size: 20px;
    padding: 4px 0;
  }

  h4 {
    color: #18181b;
    font-weight: 600;
    font-size: 16px;
    padding: 4px 0;
  }

  h5 {
    color: #18181b;
    font-weight: 600;
    font-size: 14px;
    padding: 4px 0;
  }

  h6 {
    color: #18181b;
    font-weight: 500;
    font-size: 13px;
    padding: 4px 0;
  }

  span {
    color: #18181b;
    font-weight: 400;
    font-size: 16px;
    padding: 4px 0;
  }
`;
