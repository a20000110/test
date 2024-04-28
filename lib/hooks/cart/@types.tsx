export interface AddToCartProps {
  id: string; // 产品的唯一标识 id | slug
  quantity: string; // 产品数量
  variation?: Record<string, string>; //添加变量产品的变量 所有属性都以前缀开头，全局属性前缀如`attribute_pa_`，而自定义属性只有前缀`attribute_`，两者后面都有属性slug，对比见示例
  item_data?: Record<string, string>; // 单个产品的产品属性
  return_items?: boolean; // 设置为true可在添加后返回项目详细信息。
}

export interface RemoveCartItemProps {
  item_key: string;
}

export type SetLoading = (loading: boolean) => void;

export declare namespace CartResponse {
  interface RootObject {
    cart_hash: string;
    cart_key: string;
    currency: Currency;
    customer: Customer;
    items: Item[];
    item_count: number;
    items_weight: number;
    coupons: any[];
    needs_payment: boolean;
    needs_shipping: boolean;
    shipping: Shipping;
    fees: any[];
    taxes: any[];
    totals: Totals2;
    removed_items: any[];
    cross_sells: any[];
    notices: any[];
  }

  interface Totals2 {
    [key: string]: string;

    subtotal: string;
    subtotal_tax: string;
    fee_total: string;
    fee_tax: string;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    total: string;
    total_tax: string;
  }

  interface Shipping {
    total_packages: number;
    show_package_details: boolean;
    has_calculated_shipping: boolean;
    packages: Packages;
  }

  interface Packages {
    default: Default;
  }

  interface Default {
    package_name: string;
    rates: Rates;
    package_details: string;
    index: number;
    chosen_method: string;
    formatted_destination: string;
  }

  interface Rates {
    [key: string]: Flatrate1;
  }

  interface Flatrate1 {
    key: string;
    method_id: string;
    instance_id: number;
    label: string;
    cost: string;
    html: string;
    taxes: string;
    chosen_method: boolean;
    meta_data: {
      [key: string]: string
    };
  }

  interface Item {
    item_key: string;
    id: number;
    name: string;
    title: string;
    price: string;
    quantity: Quantity;
    tax_data: Taxdata;
    totals: Totals;
    slug: string;
    meta: Meta;
    cart_item_data: {
      [key: string]: string;
    } | any[];
    featured_image: string;
  }

  interface Meta {
    product_type: string;
    sku: string;
    dimensions: Dimensions;
    weight: number;
    variation: Record<string, string>;
  }

  interface Dimensions {
    length: string;
    width: string;
    height: string;
    unit: string;
  }

  interface Totals {
    subtotal: number;
    subtotal_tax: number;
    total: number;
    tax: number;
  }

  interface Taxdata {
    subtotal: any[];
    total: any[];
  }

  interface Quantity {
    value: number;
    min_purchase: number;
    max_purchase: number;
  }

  interface Customer {
    billing_address: Billingaddress;
    shipping_address: Shippingaddress;
  }

  interface Shippingaddress {
    shipping_first_name: string;
    shipping_last_name: string;
    shipping_company: string;
    shipping_country: string;
    shipping_address_1: string;
    shipping_address_2: string;
    shipping_postcode: string;
    shipping_city: string;
    shipping_state: string;
  }

  interface Billingaddress {
    billing_first_name: string;
    billing_last_name: string;
    billing_company: string;
    billing_country: string;
    billing_address_1: string;
    billing_address_2: string;
    billing_postcode: string;
    billing_city: string;
    billing_state: string;
    billing_phone: string;
    billing_email: string;
  }

  interface Currency {
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
  }
}

export declare namespace CartTotals {
  interface RootObject {
    [key:string]:any;

    subtotal: string;
    subtotal_tax: number;
    shipping_total: string;
    shipping_tax: number;
    shipping_taxes: any[];
    discount_total: number;
    discount_tax: number;
    cart_contents_total: string;
    cart_contents_tax: number;
    cart_contents_taxes: any[];
    fee_total: string;
    fee_tax: number;
    fee_taxes: any[];
    total: string;
    total_tax: number;
  }
}
