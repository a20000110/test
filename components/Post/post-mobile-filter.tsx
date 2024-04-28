import { BodyText } from "@/components/BodyText";
import Drawer from "@/components/Drawer";
import { useState } from "react";
import PostFilter from "@/components/Post/post-filter";
import { useTranslations } from "next-intl";
import { PostDataType } from "@/pages/blog";

type Props = {
  postData: PostDataType
}
export default function PostMobileFilter(props: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  return <>
    <div
      onClick={() => setOpen(!open)}
      className="flex w-full items-center justify-between px-5 py-4 border rounded-lg mb-10 cursor-pointer lg:hidden">
      <BodyText className="font-medium capitalize" size="md">{t("common.More_Option")}</BodyText>
      <i className="ri-menu-5-fill ri-lg"></i>
    </div>
    <Drawer visible={open} title="More Option" width="90vw" onClose={() => {
      setOpen(false);
    }}>
      <div className="py-8 px-4">
        <PostFilter postData={props.postData} />
      </div>
    </Drawer>
  </>;
}
