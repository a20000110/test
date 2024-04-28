import client from "@/lib/ApolloClient/apolloClient";
import { POST_BY_SLUG } from "@/lib/queries/post-by-slug";
import { GqlPostBySlugInterface, GqlPostBySlugNodeInterface } from "@/lib/types/gql/post/post-by-slug.type";
import { GetStaticPathsResult, GetStaticPropsContext } from "next";
import PostLayout from "@/components/Layout/post-layout";
import { BodyText } from "@/components/BodyText";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import parse from "html-react-parser";
import { SocialShare } from "@/components/SingleBlog/SocialShare";
import { Spaces } from "@/components/Spaces";
import moment from "moment";
import { REVA_DATE } from "@/lib/constants";
import HeadSeo from "@/components/Seo/head-seo";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import {
  getLang,
  getPostLayoutData,
  getStaticLocalePaths,
  handlerInnerHtml,
  handlerPathSlug,
  translatePostSEO
} from "@/lib/utils/util";
import { getAllBlogSlug } from "@/lib/hooks/useGetBlogSlug";
import { SlugInterface } from "@/lib/hooks/useGetProductSlug";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { PostDataType } from "@/pages/blog/index";

type Props = {
  seo: PageSeoInterface | null;
  slug: string;
  post: GqlPostBySlugNodeInterface | null;
  postData: PostDataType
}
export default function Slug({ seo, slug, post: Post, postData }: Props) {
  const [content, setContent] = useState<string>("");
  const [comments, setComments] = useState<GqlPostBySlugNodeInterface["comments"]>();
  const [post, setPost] = useState<GqlPostBySlugNodeInterface>();
  useEffect(() => {
    Post?.content && setContent(Post.content);
    Post?.comments && setComments(Post.comments);
    Post && setPost(Post);
  }, [Post]);
  return <>
    <HeadSeo seo={seo?.data} />
    {
      !!post ? <PostLayout title={slug} postData={postData}>
        <div className="w-full">
          <div className="c-flex mb-4">
            <div className="px-2 py-1 text-white bg-main rounded-[5px]">
              {post?.categories?.nodes?.[0]?.name}
            </div>
          </div>
          <h1 className="text-3xl md:text-3xl lg:text-4xl lg:leading-10 font-bold c-flex">{post?.title}</h1>
          <div className="mt-5 mb-10 c-flex">
            <div className="flex items-center gap-6">
              <BodyText size="sm"
                        className="text-themeGray uppercase">BY: {process.env.NEXT_PUBLIC_COMPANY_NAME}
              </BodyText>
              <BodyText size="sm" className="text-themeGray uppercase">
                <i className="ri-calendar-line ri-lg mr-1" />
                <span>{moment(post?.date).startOf("hour").fromNow()}</span>
              </BodyText>
            </div>
          </div>
          <Element>
            {content &&
              parse(handlerInnerHtml(content), {
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
          <Spaces size="md" />
          <SocialShare />
          {/*<PostCommentsSection getAllComments={comments?.nodes} postID={post?.id} />*/}
        </div>
      </PostLayout> : ""
    }
  </>;
}

export const getStaticProps = async (context: GetStaticPropsContext<{ slug: string }>) => {
  const slug = handlerPathSlug(context.params!.slug);
  const promise = await Promise.all([
    client.query<GqlPostBySlugInterface>({
      query: POST_BY_SLUG,
      variables: {
        slug
      }
    }),
    translatePostSEO(slug, context.locale)
  ]);
  const data = promise[0].data;
  const prmise2 = await Promise.all([
    translateStaticProps(data.posts.nodes, ["categories.nodes[].name", "title", "content"], "en", context.locale),
    getLang(context.locale),
    getPostLayoutData(context.locale)
  ]);
  const post = prmise2[0];
  return {
    props: {
      slug,
      seo: promise[1],
      post: post?.length ? post[0] : data.posts.nodes[0],
      messages: prmise2[1],
      postData: prmise2[2]
    },
    revalidate: REVA_DATE
  };
};

export const getStaticPaths = async () => {
  const slugs: SlugInterface[] = [];
  const pathsData = await getAllBlogSlug(1, 1, slugs);
  const paths = getStaticLocalePaths(
    {
      paths: pathsData,
      fallback: "blocking"
    } as GetStaticPathsResult
  );
  console.log(paths.paths.length, "blog.length");
  return paths;
};

const Element = styled.div`
  img {
    width: 100% !important;
  }

  figure {

  }

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
