import { WpProductCateSeoModelInterface } from "@/lib/service/models/wp_product_cate_seo.model";
import WpPostCateSeoModel from "@/lib/service/models/wp_post_cate_seo.model";
// 添加分类seo

export const addProductCateSeo = (data: WpProductCateSeoModelInterface) => {
  return WpPostCateSeoModel.create(data);
};

// 根据slug获取分类seo
export const getProductCateSeoBySlug = (slug: string) => {
  return WpPostCateSeoModel.findOne({
    where: {
      slug
    }
  });
};

// 更新分类seo
export const updateProductCateSeo = (slug: string, data: Omit<WpProductCateSeoModelInterface, "slug" | "cate_id">) => {
  return WpPostCateSeoModel.update(data, {
    where: {
      slug: slug
    }
  });
};

// 根据slug删除分类Seo
export const delProductCateSeoBySlug = (slug: string) => {
  return WpPostCateSeoModel.destroy({
    where: {
      slug
    }
  });
};
