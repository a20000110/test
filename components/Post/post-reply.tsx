import React from "react";

interface replyProps {
  id: number;
}

export const Reply = ({ id }: replyProps) => {
  const contentReplace = (content: string) => {
    const replace = content.replace(/<p>/g, "<p/>");
    const replace2 = replace.replace(/(<([^>]+)>)/gi, "");
    return replace2;
  };

  return (
    <>
      {/* {data?.map((item: any, index: number) => (
        <div key={index} className="mt-10">
          <div className="flex items-start gap-5">
            <Avatar size="xxxl" src={item?.avatar} alt="image" />
            <div>
              <p className="font-sans text-base font-semibold text-themeSecondary">{item?.author}</p>
              <span className="font-sans text-sm text-themeGrayLight">
                {moment(item?.publishTime).startOf("hour").fromNow()}
              </span>
            </div>
          </div>
          <p className="pt-3 ml-5 font-sans text-base text-themeLightDark md:pt-0 md:ml-20">
            {contentReplace(item?.content)}
          </p>
        </div>
      ))} */}
    </>
  );
};
