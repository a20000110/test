const { getEnv } = require("./util");
const baseUrl = getEnv()["NEXT_PUBLIC_AI_URL"];
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// 上传语言包
const uploadLangPack = async () => {
  try {
    const info_dict = fs.readFileSync(path.join(__dirname, "../lib/constants/lang/en.json"), "utf-8");
    const res = await axios.post(`${baseUrl}/api/v1/ml_web/dict_upload_translate`, {
      info_dict: JSON.parse(info_dict),
      domain: new URL(getEnv()["NEXT_PUBLIC_WORDPRESS_URL"]).hostname
    });
    console.log(res.data,"uploadLang.js");
  } catch (e) {
    console.log("上传语言包Error:", e);
  }
};


uploadLangPack();
