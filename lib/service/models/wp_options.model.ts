import { DataTypes, Model } from "sequelize";
import seq from "../db/seq";
export interface WpOptionsModelInterface {
  option_id: number;
  option_name: string;
  option_value: string;
  autoload: string;
}
const tableName = "wp_options";
const WpOptions = seq().define<Model<WpOptionsModelInterface>>(tableName, {
  option_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  option_name: {
    type: DataTypes.STRING(191),
    allowNull: false
  },
  option_value: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  autoload: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: tableName,
  timestamps: false,
  underscored: true
});

WpOptions.sync({ force: false }).then(r => {
  console.log("创建wp_options表成功");
}).catch(e => {
  console.log("创建wp_options表失败", e);
});


export default WpOptions;
