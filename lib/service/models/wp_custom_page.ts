import { DataTypes, Model } from "sequelize";
import seq from "../db/seq";

export interface WpCustomPageModelInterface {
  page_id: string;
  authority: number;
  router_name: string;
}

const WpCustomPage = () => {
  if (!global.WpCustomPage) {
    global.WpCustomPage = seq().define<Model<WpCustomPageModelInterface>>("wp_custom_page", {
      page_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        comment: "页面ID"
      },
      authority: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "页面权限，是否登录才能访问"
      },
      router_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        comment: "路由名称"
      }
    });
    global.WpCustomPage.sync({ force: false }).then(r => {
      console.log("创建wp_custom_page表成功");
    }).catch(e => {
      console.log("创建wp_custom_page表失败", e);
    });
  }
  return global.WpCustomPage
};

export default WpCustomPage;
