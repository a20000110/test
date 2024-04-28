import Model from "../models/wp_custom_page_seo";

const WpPageSepModel = Model();
// 获取页面SEO
export const getPageSeo = async (page_id: string) => {
  return WpPageSepModel.findOne({
    where: {
      page_id
    }
  });
};

// 添加页面SEO
export const addPageSeo = async (page_id: string, seo: any) => {
  return WpPageSepModel.create({
    page_id,
    data: seo
  });
};

// 修改页面SEO
export const updatePageSeo = async (page_id: string, seo: any): Promise<number[]> => {
  return WpPageSepModel.update({ data: seo }, {
    where: {
      page_id
    }
  });
};

// 添加页面SEO 如果存在那么就修改
export const addOrUpdatePageSeo = async (page_id: string, seo: any) => {
  const postSeo = await getPageSeo(page_id);
  if (postSeo) {
    const result = await updatePageSeo(page_id, seo);
    return !!result && !!result[0];
  } else {
    const result = await addPageSeo(page_id, seo);
    return !!result && !!result.uniqno;
  }
};

