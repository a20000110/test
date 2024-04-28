const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getEnv } = require("./util");
const { getWebConfig } = require("./langAuth");

const baseUrl = getEnv()["NEXT_PUBLIC_AI_URL"];
const domain = new URL(getEnv()["NEXT_PUBLIC_WORDPRESS_URL"]).hostname;
const fileName = "languagePack.json";

// 获取语言列表
const getLangPack = async () => {
  const res = await axios.post(`${baseUrl}/api/v1/ml_web/get_translate_code?domain=${domain}`);
  return res.data;
};
getLangPack().then(res => {
  console.log(res);
  if (res.code === 200) {
    // 在项目最外层根路径写入文件
    fs.writeFile(path.join(__dirname, "../", fileName), JSON.stringify(res.result.data), err => {
      if (err) {
        console.log(err);
      } else {
        getWebConfig();
        console.log("语言列表载入成功");
      }
    });
  }
}).catch(err => {
  console.log("获取语言包失败", err);
});

