import { DataTypes, Model } from "sequelize";
import seq from "../db/seq";
export interface WpProductCateSeoModelInterface {
  cate_id: number;
  slug: string;
  banner: string;
  seo: string;
}

const tableName = "wp_product_cate_seo";
const WpProductCateSeoModel = seq().define<Model<WpProductCateSeoModelInterface>>(tableName, {
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
WpProductCateSeoModel.sync({ force: false }).then(r => {
  console.log("创建WpProductCateSeo表成功");
}).catch(e => {
  console.log("创建WpProductCateSeo表失败", e);
});
export default WpProductCateSeoModel;
