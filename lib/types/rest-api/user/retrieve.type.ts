import { WooGetResponse } from "@/lib/Woocommerce/WooCommerceRApi";

export type RetrieveUser = WooGetResponse<RetrieveUserRootObject>

export interface RetrieveUserRootObject {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: RetrieveBilling;
  shipping: RetrieveShipping;
  is_paying_customer: boolean;
  avatar_url: string;
  meta_data: Metadatum[];
  _links: Links;
}

interface Links {
  self: Self[];
  collection: Self[];
}

interface Self {
  href: string;
}

interface Metadatum {
  id: number;
  key: string;
  value: string;
}

export interface RetrieveShipping {
  [key:string]:string
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  phone: string;
}

export interface RetrieveBilling {
  [key:string]:string
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  email: string;
  phone: string;
}
