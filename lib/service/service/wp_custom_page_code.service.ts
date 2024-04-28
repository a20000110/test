import WpPageCodeModel from "../models/wp_custom_page_code";

// 获取页面代码
export const getPageCode = async (page_id: string) => {
  return await WpPageCodeModel.findOne({
    where: {
      page_id
    }
  });
};

// 添加页面代码
export const addPageCode = async (page_id: string, code: string) => {
  return await WpPageCodeModel.create({
    page_id,
    code
  });
};

// 修改页面代码
export const updatePageCode = async (page_id: string, code: string) => {
  return await WpPageCodeModel.update({
    code
  }, {
    where: {
      page_id
    }
  });
};

// 添加/修改页面代码
export const setPageCode = async (page_id: string, code: string) => {
  const pageCode = await getPageCode(page_id.toString());
  if (pageCode) {
    const result = await updatePageCode(page_id, code);
    return !!result && !!result[0];
  } else {
    const result = await addPageCode(page_id, code);
    return !!result && !!result.uniqno;
  }
};

// 删除页面代码
export const delPageCode = async (page_id: string) => {
  const postCode = await getPageCode(page_id);
  if (postCode) {
    const res = await WpPageCodeModel.destroy({
      where: {
        page_id
      }
    });
    return !!res;
  }
  return false;
};
