import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BodyText } from "@/components/BodyText";
import { useTranslations } from "next-intl";
import { translateStaticProps } from "@/lib/utils/translate-util";



export const Breadcrumb = ({ name }: { name: string }) => {
  return (
    <div className="py-16 font-sans bg-themeSecondary100 " style={{backgroundImage: "url(/image/cp-banner.jpg)",backgroundPosition: "center",backgroundSize: "cover",padding:"8%"}}>
      <div className="container">
        <h1 className="Constantia  text-3xl lg:text-6xl capitalize">{name}</h1>
      </div>

    </div>
  );
};
