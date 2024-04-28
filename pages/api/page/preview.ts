import { NextApiRequest, NextApiResponse } from "next";
import { setCorsHeaders } from "@/lib/utils/util";
import { Error } from "@/lib/service/inquiry/constant";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method !== "POST") {
      return res.status(405).end();
    }
    const contentHtml = req.body?.html as string;
    const html = `
       <!DOCTYPE html>
    <html>
      <head>
        <title>Title</title>
      </head>
      <body>
        <h1>Generating preview interface...</h1>
           <script type="text/javascript">
  // 将content 存在会话存储中
  if (typeof window !== "undefined") {
window.sessionStorage.setItem("content", ${JSON.stringify(encodeURIComponent(contentHtml))});
  const content =   window.sessionStorage.getItem("content");
  if (content) {
        window.location.href = "/preview";
  }
  }
</script>
      </body>
    </html>
    `;
    res.setHeader("Content-Type", "text/html");
    res.end(html);
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}
