import { DataTypes } from "sequelize";
import seq from "../db/seq";

const WpCustomPageSeo = ()=>{
  if (!global.WpCustomPageSeo){
    global.WpCustomPageSeo = seq().define<any>("wp_custom_page_seo", {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      page_id: {
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
    global.WpCustomPageSeo.sync({ force: false }).then(r => {
      console.log("创建pageSeo表成功");
    }).catch(e => {
      console.log("创建pageSeo表失败", e);
    });
  }else {
    console.log("复用pageSeo");
  }
  return global.WpCustomPageSeo

}
export default WpCustomPageSeo;
