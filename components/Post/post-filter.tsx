import PostSearch from "@/components/Post/post-search";
import PostCategories from "@/components/Post/post-categories";
import PostRecent from "@/components/Post/post-recent";
import PostTag from "@/components/Post/post-tag";
import React, { useEffect } from "react";
import PostPersonal from "@/components/Post/post-personal";
import { PostDataType } from "@/pages/blog";

type Props = {
  postData: PostDataType
}

function PostFilter(props: Props) {
  return <div className="flex flex-col gap-y-6">
    <PostSearch />
    <PostPersonal />
    <PostCategories cate={props.postData.categories} />
    <PostRecent recent={props.postData.recent} />
    <PostTag tags={props.postData.tags} />
  </div>;
}

export default PostFilter;
