import { DataTypes } from "sequelize";
import seq from "../db/seq";

const WpInquiryFormField = seq().define<any>("wp_inquiry_form_fields", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  form_content: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue("form_content");
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
      this.setDataValue("form_content", JSON.stringify(value));
    }
  }
});

// 创建表
WpInquiryFormField.sync({ force: false }).then(() => {
  console.log("创建询盘表单字段表成功");
  // 查找id为1的询盘表单字段，没有则创建
  WpInquiryFormField.findOne({ where: { id: 1 } }).then(r => {
    if (!r) {
      WpInquiryFormField.create({
        id: 1,
        form_content: [{
          type: "email",
          label: "Email",
          name: "email",
          required: true,
          placeholder: "Email"
        }, {
          type: "text",
          label: "Phone",
          name: "phone",
          required: true,
          placeholder: "Phone"
        }, {
          type:"text",
          label:"Company",
          name:"company",
          required:true,
          placeholder:"Company"
        }]
      });
    }
  });
}).catch(e => {
  console.log("创建询盘表单字段表失败", e);
});

export default WpInquiryFormField;
