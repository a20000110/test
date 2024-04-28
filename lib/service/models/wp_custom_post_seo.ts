import { DataTypes } from "sequelize";
import seq from "../db/seq";

const WpCustomPostSeo = seq().define<any>("wp_custom_post_seo", {
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false
  }
});


// 创建表
WpCustomPostSeo.sync({ force: false }).then(r => {
  console.log("创建postSeo表成功");
}).catch(e => {
  console.log("创建postSeo表失败", e);
});

export default WpCustomPostSeo;
