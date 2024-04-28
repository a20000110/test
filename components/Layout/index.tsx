import React, { ReactNode, useEffect } from "react";
import PageScrollEvent from "@/components/PageScrollEvent";
import Topping from "@/components/Topping";
import FooterMenu from "@/components/Mobile/footer-menu";
import { Analytics } from "@vercel/analytics/react";
import { isDev } from "@/lib/utils/util";
import Footer from "@/components/Footer";
import { Nav } from "@/components/Nav";
import OnLineChat from "@/components/OnLineChat";
import PintreelAnalysis from "@/components/PintreelAnalysis";
import SliderPart from "@/components/SlidePart/slide-part";
import { useCart } from "@/lib/hooks/cart/useCart";
import { useRouter } from "next/router";

export const AppLayout = ({ children, pageProps }: { children: ReactNode, pageProps: any }) => {
  const { getCart } = useCart();
  const router = useRouter();
  useEffect(() => {
    getCart();
  }, [router]);
  return <>
    <main className="min-h-[100vh] font-SGB">
      <PintreelAnalysis />
      <Nav />
      <section className="pt-header-height max-md:pt-[92px]">
        {children}
        {
          !isDev && <Analytics />
        }
      </section>
      <Footer />
      <SliderPart />
      <OnLineChat />
      <FooterMenu />
      <Topping />
      <PageScrollEvent nodeIds={["topping", "slider-part"]} />
    </main>
  </>;
};
