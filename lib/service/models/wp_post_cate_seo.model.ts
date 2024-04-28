import { DataTypes, Model } from "sequelize";
import seq from "../db/seq";
import { WpProductCateSeoModelInterface } from "@/lib/service/models/wp_product_cate_seo.model";

const tableName = "wp_post_cate_seo";
const WpPostCateSeoModel = seq().define<Model<WpProductCateSeoModelInterface>>(tableName, {
  cate_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  banner: {
    type: DataTypes.STRING,
    allowNull: false
  },
  seo: {
    type: DataTypes.TEXT,
    allowNull: false
  }
},{
  tableName: tableName
})
WpPostCateSeoModel.sync({ force: false }).then(r => {
  console.log("创建WpPostCateSeo表成功");
}).catch(e => {
  console.log("创建WpPostCateSeo表失败", e);
});
export default WpPostCateSeoModel;
