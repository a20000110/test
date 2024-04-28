import { useEffect } from "react";
import { isDev } from "@/lib/utils/util";

export default function PintreelAnalysis() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = isDev ? "http://localhost:3000/script.js" : "https://analysis.pintreel.com/script.js";
    script.setAttribute("data-website-id", "41f1de78-1b81-4b83-a64e-030771cddfd2");
    script.async = true;
    // 在head插入
    document.head.appendChild(script);
  }, []);
  return <></>;
}
