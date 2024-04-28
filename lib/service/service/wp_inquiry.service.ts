import WpInquiryModel from "../models/wp_inquiry.model";
import { QueryInquiryInterface } from "@/pages/api/inquiry/get-inquiry";
import { Op } from "sequelize";

const send = async (data: any) => {
  return WpInquiryModel.create(data);
};

const query = async (data: QueryInquiryInterface) => {
  const { page, pageSize, woocommerce_user, filter_time, status, source } = data;
  let where = {};
  if (filter_time) {
    if (filter_time.start && filter_time.start.toString().length === 10) {
      filter_time.start = filter_time.start * 1000;
    }
    if (filter_time.end && filter_time.end.toString().length === 10) {
      filter_time.end = filter_time.end * 1000;
    }
    where = {
      ...where,
      createdAt: {
        [Op.between]: [new Date(filter_time.start), new Date(filter_time.end)]
      }
    };
  }

  woocommerce_user && (where = {
    ...where,
    woocommerce_user
  });

  (status === 0 || status === 1) && (where = {
    ...where,
    status
  });
  (source === 0 || source === 1) && (where = {
    ...where,
    source
  });
  return await WpInquiryModel.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset: (page - 1) * pageSize,
    limit: pageSize
  });
};

const updateStatus = async (ids: number[]) => {
  if (ids[0] === 0) {
    return WpInquiryModel.update({ status: 1 }, { where: { status: 0 } });
  } else {
    return WpInquiryModel.update({ status: 1 }, { where: { id: { [Op.in]: ids } } });
  }
};

export default {
  send,
  query,
  updateStatus
};
