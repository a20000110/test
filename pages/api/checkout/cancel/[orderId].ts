import { NextApiRequest, NextApiResponse } from "next";
import { cApiUrl, setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    const { orderId, process_url } = req.query;
    if (req.method !== "GET" || !orderId || !process_url) {
      return res.status(405).end();
    }
    const result = await fetch(process_url as string).then((res) => res.text())
    const html = `
      <!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Processing...</title>
  <style>
      .box {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
      }

      .icon {
          animation: rotate 1s linear infinite;
      }

      @keyframes rotate {
          0% {
              transform: rotate(0deg);
          }
          100% {
              transform: rotate(360deg);
          }
      }
  </style>
</head>
<body>
<div class="box">
  <svg t="1711950122151" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
       p-id="4288" width="60" height="60">
    <path d="M204.8 204.8m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z" fill="#EBF2FC"
          p-id="4289"></path>
    <path d="M819.2 204.8m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z" fill="#B5D2F3"
          p-id="4290"></path>
    <path d="M819.2 819.2m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z" fill="#7FB0EA"
          p-id="4291"></path>
    <path d="M204.8 819.2m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z" fill="#4A90E2"
          p-id="4292"></path>
  </svg>
  <p>Processing...</p>
</div>
</body>
 <script type="text/javascript">
      window.open("${cApiUrl}/checkout?cancel_orderId=${orderId}","_self");
</script>
</html>
    `
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}



