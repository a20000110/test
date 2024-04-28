import React, { useState } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import axios from "axios";
import { GqlPostBySlugNode2Interface } from "@/lib/types/gql/post/post-by-slug.type";
import { Avatar } from "@/components/Avatar";
import { useTranslations } from "next-intl";

interface CommentsProps {
  item: GqlPostBySlugNode2Interface;
  postID: string;
}

export const PostCommentItem = ({ item, postID }: CommentsProps) => {
  const t = useTranslations();
  const [commentLoader, setCommentLoader] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showErrMessage, setShowErrMessage] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const [isOpen, setIsOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data: any) => {
    setCommentLoader(true);
    const replyDataInput = {
      author_name: data?.name,
      author_email: data?.email,
      content: data?.message,
      post: postID,
      parentId: data?.commentId
    };

    await axios
      .post(`/api/comments/reply-comment`, replyDataInput)
      .then((res) => {
        reset();
        setShowErrMessage(false);
        setErrMessage("");
        setShowMessage(true);
        setCommentLoader(false);
      })
      .catch((err) => {
        setShowMessage(false);
        setShowErrMessage(true);
        setErrMessage(err?.message);
        setCommentLoader(false);
      });
  };

  const contentReplace = (content: string) => {
    const replace = content.replace(/<p>/g, "<p/>");
    const replace2 = replace.replace(/(<([^>]+)>)/gi, "");
    return replace2;
  };

  const bodyRef = React.useRef(null);

  return (
    <div className="pt-10 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-5">
          <Avatar size="lg" src={""} alt="image" />
          <div>
            <p className="font-sans text-base font-semibold text-themeSecondary">{item?.author.node.name}</p>
            <span className="font-sans text-sm text-themeGrayLight">
              {moment(item?.date).startOf("hour").fromNow()}
            </span>
          </div>
        </div>

        {/* start modal here */}
        <div>
          {isOpen && (
            <div className="fixed inset-x-0 bottom-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
              <div
                ref={bodyRef}
                className="transition-all transform bg-white rounded-lg shadow-lg sm:max-w-lg sm:w-full border"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <p
                      onClick={() => {
                        setIsOpen(!isOpen);
                        reset();
                      }}
                      className="pb-4 text-lg font-medium leading-6 text-gray-900 transition-all duration-300 cursor-pointer hover:text-blue-300 ml-auto w-fit"
                    >
                      {t("post.Cancle")}
                    </p>
                    {showMessage && (
                      <p
                        className="px-10 mt-10 mb-6 font-bold border-l-4 rounded-lg bg-themeSuccess100 text-themeSuccess900 font-2xl py-7 border-themeSuccess500">
                        {t("message.6a5e329ee182094a496a22b0b2055b6f42ec")}
                      </p>
                    )}
                    {showErrMessage && (
                      <p
                        className="px-10 mt-10 mb-6 font-bold border-l-4 rounded-lg bg-themeWarning100 text-themeWarning900 font-2xl py-7 border-themeWarning500">
                        {errMessage}
                      </p>
                    )}
                    <div className="mt-2 hidden">
                      <input
                        className="block w-full px-4 py-3 transition duration-150 ease-in-out border rounded-md form-input sm:text-sm sm:leading-5 focus:outline-none"
                        type="text"
                        placeholder="Id"
                        defaultValue={item?.id}
                        {...register("commentId")}
                      />
                    </div>
                    <div className="mt-2">
                      <input
                        className={`block w-full px-4 py-3 transition duration-150 ease-in-out border rounded-md form-input sm:text-sm sm:leading-5 focus:outline-none ${
                          errors?.name ? "border-red-500" : "border-themeSecondary100"
                        }`}
                        type="text"
                        placeholder={t("common.Name")}
                        {...register("name", { required: true })}
                      />
                    </div>
                    <div className="mt-2">
                      <input
                        className={`block w-full px-4 py-3 transition duration-150 ease-in-out border rounded-md form-input sm:text-sm sm:leading-5 focus:outline-none ${
                          errors?.email ? "border-red-500" : "border-themeSecondary100"
                        }`}
                        type="email"
                        placeholder={t("common.Email")}
                        {...register("email", { required: true })}
                      />
                    </div>
                    <div className="mt-2">
                      <textarea
                        className={`block w-full h-32 px-4 py-3 transition duration-150 ease-in-out border rounded-md form-input sm:text-sm sm:leading-5 focus:outline-none ${
                          errors?.message ? "border-red-500" : "border-themeSecondary100"
                        }`}
                        placeholder={t("common.Message")}
                        {...register("message", { required: true })}
                      />
                    </div>
                    <button
                      disabled={commentLoader}
                      type="submit"
                      className="px-6 py-3 mt-5 text-white bg-blue-500 rounded flex justify-center capitalize"
                    >
                      {/* {commentLoader && <LoaderRound />} */}
                      <span
                        className={`${commentLoader ? "ml-2" : ""}`}>{commentLoader ? t("common.Wait") + ".." : t("common.reply")}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        {/*end  modal here */}
        {/*<div*/}
        {/*  onClick={() => setIsOpen(!isOpen)}*/}
        {/*  className="flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer h-fit bg-themeSecondary100"*/}
        {/*>*/}
        {/*  <BodyText intent="medium">Reply</BodyText>*/}
        {/*  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
        {/*    <path*/}
        {/*      d="M1.25 5.5H8.75C10.3413 5.5 11.8674 6.13214 12.9926 7.25736C14.1179 8.38258 14.75 9.9087 14.75 11.5V13M1.25 5.5L5.75 10M1.25 5.5L5.75 1"*/}
        {/*      stroke="#4B5563"*/}
        {/*      strokeWidth="2"*/}
        {/*      strokeLinecap="round"*/}
        {/*      strokeLinejoin="round"*/}
        {/*    />*/}
        {/*  </svg>*/}
        {/*</div>*/}
      </div>
      <div className="pt-5 mb-10 md:ml-20 lg:pt-2">
        <p className="font-sans text-base text-themeLightDark">{contentReplace(item?.content)}</p>
        {/*<Reply id={item?.id} />*/}
      </div>
    </div>
  );
};
