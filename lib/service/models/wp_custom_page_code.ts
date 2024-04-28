import { DataTypes, Model } from "sequelize";
import seq from "../db/seq";

const WpCustomPageCode = seq().define<any>("wp_custom_page_code", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  page_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ""
  }
});

// 创建表
WpCustomPageCode.sync({ force: false }).then(r => {
  console.log("创建pageCode表成功");
}).catch(e => {
  console.log("创建pageCode表失败", e);
});

export default WpCustomPageCode;
