import { DocumentProps, Head, Html, Main, NextScript } from "next/document";

export default function Document(data: DocumentProps) {
  return (
    <Html lang={data.locale || "en"}>
      {/* @ts-ignore */}
      <Head />
      <body>
      <Main />
      {/* @ts-ignore */}
      <NextScript />
      </body>
    </Html>
  );
}
