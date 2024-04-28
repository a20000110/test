import WpPostsModel from "../models/wp_posts.model";
import WpPosts from "../models/wp_posts.model";
import WpPostMetaModel from "../models/wp_postmeta.model";
import { Op } from "sequelize";

export const getProductInfoById = async (id: number | string) => {
  const product = await WpPostsModel.findOne({
    where: {
      ID: id,
      post_type: "product"
    },
    include: [{
      model: WpPostMetaModel,
      as: "metas",
      required: false,
      where: {
        meta_key: "_thumbnail_id"
      },
      attributes: ["meta_value", "post_id"]
    }],
    attributes: ["ID", "post_title"]
  });
  if (!product) {
    return;
  }
  const post_name = (await getProductSlugById(id))?.post_name;
  return {
    id: product.ID,
    name: product.post_title,
    image: await getProductImageById(product.metas[0].meta_value) || "",
    link: post_name ? `/product/${post_name}` : ""
  };
};


// 根据产品id获取产品图片
export const getProductImageById = async (productImageId: number | string): Promise<string> => {
  try {
    const productImage = await WpPosts.findOne({
      where: {
        ID: {
          [Op.eq]: +productImageId
        }
      },
      attributes: [["guid", "product_image_url"]]
    });
    if (!productImage) {
      return "";
    } else {
      return productImage.dataValues.product_image_url || "";
    }
  } catch (e) {
    return "";
  }
};

export const getProductSlugById = async (id: number | string) => {
  return await WpPostsModel.findOne({
    where: {
      ID: id
    },
    attributes: ["post_name"]
  });
};
