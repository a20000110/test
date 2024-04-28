const fs = require("fs");
const path = require("path");

// 读取根目录下的.env文件,并转成json格式
exports.getEnv = () => {
  const envPath = path.join(__dirname, "../.env");
  const env = fs.readFileSync(envPath, "utf-8");
  return env.split("\n").reduce((pre, cur) => {
    if (!cur || cur.startsWith("#")) return pre;
    const [key, value] = cur.split("=");
    pre[key] = value?.replace("\r", "");
    return pre;
  }, {});
};

// 修改env并覆盖env
exports.setEnv = (key, value) => {
  const env = exports.getEnv();
  env[key] = value;
  fs.writeFileSync(path.join(__dirname, "../.env"), Object.keys(env).reduce((pre, cur) => {
    pre += `${cur}=${env[cur]}\n`;
    return pre;
  }, ""));
};
