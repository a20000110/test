import WpInquiryFormFieldModel from "../models/wp_inquiry_form_field.model";

// 获取表单字段
const get = () => {
  return WpInquiryFormFieldModel.findOne();
};

// 修改表单字段
const set = (data: []) => {
  return WpInquiryFormFieldModel.update({
    form_content: data
  }, { where: { id: 1 }, returning: true });
};


export default {
  get,
  set
};
