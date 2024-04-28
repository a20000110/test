import { Placeholder } from "@/components/Placeholder";
import { BodyText } from "@/components/BodyText";
import Link from "next/link";
import { GqlPostsNodeInterface } from "@/lib/types/gql/post/post.type";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/CatalystUi/avatar";

export default function PostCard({ post: Post }: { post: GqlPostsNodeInterface }) {
  const [post, setPost] = useState<GqlPostsNodeInterface>();

  useEffect(() => {
    setPost(Post);
  }, [Post]);

  const t = useTranslations();
  return <Link href={`/blog/${post?.slug}`} className="hover:-translate-y-2 hover:shadow-2xl duration-300 shadow">
    <div className="h-fit bg-white rounded-t-[10px] overflow-hidden">
      <div className="flex items-center justify-center flex-col w-fit relative">
        <Placeholder src={post?.featuredImage?.node?.sourceUrl} imageHeight={500} imageWidth={500} fit={"cover"} />
        <div className="absolute h-[30px] b-flex text-white bottom-0 s-flex w-full px-4 bg-[rgba(0,0,0,0.5)]">
          <div className="s-flex gap-x-1">
            <div className="w-[24px] h-[24px] max-md:w-[18px] max-md:h-[18px] bg-white rounded-full overflow-hidden">
              <Avatar src={"/favicon.ico"} />
            </div>
            <span className="max-md:text-xs"> {
              process.env.NEXT_PUBLIC_COMPANY_NAME
            }</span>
          </div>
          <div>
            <div className="relative">
              <i className="ri-chat-4-line"></i>
              <div className="absolute text-[8px] right-[-3px] top-0 bg-main rounded-full w-[12px] h-[12px] c-flex">{
                post?.commentCount ? post.commentCount > 99 ? 99 : post.commentCount : 0
              }</div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 max-md:p-2 max-md:h-auto h-[240px]">
        <BodyText className="py-4 max-md:hidden text-mainText line-clamp-1">
        {/*<span>*/}
        {/*  {post?.categories?.nodes && post.categories.nodes[0]?.name}*/}
        {/*</span>*/}
        {/*  <span className="px-2">/</span>*/}
          <span>
          {
            moment(post?.date).format("DD MMM YYYY")
          }
        </span>
        </BodyText>
        <p className="line-clamp-2 font-bold !text-xl max-md:!text-[14px] max-md:line-clamp-1">{post?.title}</p>
        <BodyText className="my-2 max-md:my-1 max-md:line-clamp-2 line-clamp-3 text-themeSecondary400" size="sm"
                  innerHTML={post?.excerpt} />
        <BodyText size="sm" className="text-main">{t("post.25ede0b782bce4430c0aa623c00dbdbec902")}</BodyText>
      </div>
    </div>
  </Link>;
}
