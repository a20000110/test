import WpPostSeoModel from "../models/wp_custom_post_seo";

// 获取帖子产品SEO
export const getPostSeo = async (slug: string) => {
  return WpPostSeoModel.findOne({
    where: {
      slug
    }
  });
};

// 添加帖子产品SEO
export const addPostSeo = async (slug: string, seo: any) => {
  return WpPostSeoModel.create({
    slug,
    data: seo
  });
};

// 修改帖子产品SEO
export const updatePostSeo = async (slug: string, seo: any): Promise<number[]> => {
  return WpPostSeoModel.update({ data: seo }, {
    where: {
      slug
    }
  });
};

// 添加帖子产品SEO 如果存在那么就修改
export const addOrUpdatePostSeo = async (slug: string, seo: any) => {
  const postSeo = await getPostSeo(slug);
  if (postSeo) {
    const result = await updatePostSeo(slug, seo);
    return !!result && !!result[0];
  } else {
    const result = await addPostSeo(slug, seo);
    return !!result && !!result.uniqno;
  }
};

// 删除SEO
export const delPostSeo = async (slug: string) => {
  const postSeo = await getPostSeo(slug);
  if (postSeo) {
    const res = await WpPostSeoModel.destroy({
      where: {
        slug
      }
    });
    return !!res;
  }
  return false;
};
