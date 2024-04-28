import "@/styles/globals.css";
import "remixicon/fonts/remixicon.css";
import { AppLayout } from "@/components/Layout";
import { useProductStore } from "@/lib/store/product.store";
import React, { useEffect } from "react";
import PRICE_UNIT from "@/lib/queries/price-unit";
import client from "@/lib/ApolloClient/apolloClient";
import { GqlPriceUnit } from "@/lib/types/gql/product/price-unit.type";
import "animate.css";
import { siteStore } from "@/lib/store/site.store";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App({ Component, pageProps }: any) {
  const router = useRouter();
  const { setCurrencyUnit } = useProductStore();

  const getCurrencyUnit = async () => {
    const { data } = await client.query<GqlPriceUnit>({
      query: PRICE_UNIT
    });
    data?.cart?.rawSubtotal && setCurrencyUnit(data?.cart?.rawSubtotal?.replace(/[0-9.]/g, "") || "$");
  };
  const { getSiteType } = siteStore();

  useEffect(() => {
    Promise.all([getSiteType(),
      getCurrencyUnit()
    ]);
  }, []);
  return (
    <NextIntlClientProvider
      locale={router.locale}
      messages={pageProps.messages}
      timeZone={"Europe/Vienna"}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AppLayout pageProps={pageProps}>
        <Component {...pageProps} />
      </AppLayout>
    </NextIntlClientProvider>
  );
}

export default React.memo(App);
