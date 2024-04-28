const { getEnv, setEnv } = require("./util");
const axios = require("axios");

const softBaseUrl = getEnv()["NEXT_PUBLIC_SOFT_URL"];
const domain = new URL(getEnv()["NEXT_PUBLIC_WORDPRESS_URL"]).hostname;

// 获取网站配置，判断是否开启了多语言
exports.getWebConfig = async () => {
  const res = await axios.get(`${softBaseUrl}/api/pinshop/account/get_site_type`, {
    params: {
      domain
    }
  });
  const { data } = res;
  console.log(data,"langAuth.js");
  if (data.code === 1) {
    // 修改环境变量
    setEnv("NEXT_PUBLIC_MULTI_LANGUAGE", data.data.is_multi_language);
  } else {
    console.log("获取网站配置失败",data);
    setEnv("NEXT_PUBLIC_MULTI_LANGUAGE", 0);
  }
  return data.data;
};
