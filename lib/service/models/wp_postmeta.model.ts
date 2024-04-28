import { DataTypes } from "sequelize";
import seq from "../db/seq";
const tableName = "wp_postmeta";

const WpPostMeta = seq().define<any>(tableName, {
  meta_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  post_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0
  },
  meta_key: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meta_value: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: tableName,
  timestamps: false,
  underscored: true
});

WpPostMeta.sync({ force: false }).then(r => {
  console.log("创建wp_postmeta表成功");
}).catch(e => {
  console.log("创建postmeta表失败", e);
});


export default WpPostMeta;
