import Model, { WpCustomPageModelInterface } from "@/lib/service/models/wp_custom_page";

const WpCustomPageModel = Model()

export const getCustomPageList = async (page: string, limit: string) => {
  return await WpCustomPageModel.findAndCountAll({
    limit: Number(limit),
    offset: (Number(page) - 1) * Number(limit),
    order: [["createdAt", "DESC"]]
  });
};

// 根据page_id获取页面信息
export const getPageById = async (pageId: string) => {
  const res = await WpCustomPageModel.findOne({
    where: {
      page_id: pageId
    }
  });
  return res ? res.dataValues : null;
};

export const getPageByName = async (router_name: string) => {
  const res = await WpCustomPageModel.findOne({
    where: {
      router_name: router_name
    }
  });
  return res ? res.dataValues : null;
};

// 添加页面信息
export const addCustomPage = async (data: WpCustomPageModelInterface) => {
  const res = await WpCustomPageModel.create(data);
  return res ? res.dataValues : null;
};

// 修改页面信息
export const updatePageById = async (pageId: string, data: Omit<WpCustomPageModelInterface, "page_id">) => {
  const res = await WpCustomPageModel.update(data, {
    where: {
      page_id: pageId
    }
  });
  return res ? res[0] : null;
};
// 删除页面信息
export const delPageById = async (pageId: string) => {
  const res = await WpCustomPageModel.destroy({
    where: {
      page_id: pageId
    }
  });
  return res ? res : null;
};
