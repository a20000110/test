import { WpProductCateSeoModelInterface } from "@/lib/service/models/wp_product_cate_seo.model";

export declare namespace ProductCate {
  interface SeoInterface extends Omit<WpProductCateSeoModelInterface, "seo"> {
    seo: {
      [key: string]: any
    };
  }
}
