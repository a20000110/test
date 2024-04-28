import React from "react";
import { useRouter } from "next/router";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from "react-share";
import { BodyText } from "@/components/BodyText";
import { useTranslations } from "next-intl";


export const SocialShare = () => {
  const router = useRouter();

  const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`;
  const t = useTranslations();
  return (
    <div className="flex gap-7">
      <BodyText intent="medium" size="md" className="text-themeSecondary900">
        {t("singleblog.abee92899d89d64cf108ccd7084dc4ad11b6")}
      </BodyText>
      <div className="flex gap-2">
        <FacebookShareButton url={fullUrl}>
          <FacebookIcon size={26} round />
        </FacebookShareButton>
        <TwitterShareButton url={fullUrl}>
          <TwitterIcon size={26} round />
        </TwitterShareButton>
        <LinkedinShareButton url={fullUrl}>
          <LinkedinIcon size={26} round />
        </LinkedinShareButton>
        <WhatsappShareButton url={fullUrl}>
          <WhatsappIcon size={26} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
};
