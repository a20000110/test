import { DataTypes } from "sequelize";
import seq from "../db/seq";

const WpInquiry = seq().define<any>("wp_inquiry", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    comment: "询盘id",
    autoIncrement: true
  },
  goods: {
    type: DataTypes.TEXT,
    comment: "询盘商品",
    get() {
      const value = this.getDataValue("goods");
      if (typeof value === "string") {
        return JSON.parse(value);
      }
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "boolean") {
        return value;
      }
      if (typeof value === "object") {
        return value;
      }
    },
    set(value: string[] | number[]) {
      this.setDataValue("goods", JSON.stringify(value));
    }
  },
  woocommerce_user: {
    type: DataTypes.TEXT,
    comment: "注册的询盘用户",
    defaultValue: null
  },
  status: {
    type: DataTypes.INTEGER,
    comment: "询盘状态",
    defaultValue: 0
  },
  source: {
    type: DataTypes.INTEGER,
    comment: "询盘来源",
    defaultValue: 0 // 0 表示 询盘 1 表示 联系我们
  },
  inquiry_info: {
    type: DataTypes.TEXT,
    comment: "询盘信息",
    get() {
      const value = this.getDataValue("inquiry_info");
      if (typeof value === "string") {
        return JSON.parse(value);
      }
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "boolean") {
        return value;
      }
      if (typeof value === "object") {
        return value;
      }
    },
    set(value) {
      this.setDataValue("inquiry_info", JSON.stringify(value));
    }
  }
});


// 创建表
WpInquiry.sync({ force: false }).then(r => {
  console.log("创建询盘表成功");
}).catch(e => {
  console.log("创建询盘表失败", e);
});

export default WpInquiry;
