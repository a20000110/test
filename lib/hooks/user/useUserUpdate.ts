import axios from "axios";
import {
  RetrieveBilling,
  RetrieveShipping,
  RetrieveUser,
  RetrieveUserRootObject
} from "@/lib/types/rest-api/user/retrieve.type";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useCart } from "@/lib/hooks/cart/useCart";

export function useUpdateCustomer() {
  const [customer, setCustomer] = useState<RetrieveUser>();
  const t = useTranslations();
  const { getCart } = useCart();
  const fetchData = async () => {
    try {
      const res = await fetch("/api/auth/retrieve");
      const data = await res.json() as RetrieveUser;
      setCustomer(data);
    } catch (e: any) {
      toast(e.message || t("message.fb1ec174b6ac8f409ffa6ebdf48e2666cc5e"), { type: "error" });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  async function updateCustomer(userInfoUdate: any) {
    try {
      const { avatar_url, ...rest } = userInfoUdate;
      const response = await axios.put(`/api/auth/update`, rest);
      return response.data;
    } catch (e: any) {
      toast(e.message || t("message.fb1ec174b6ac8f409ffa6ebdf48e2666cc5e"), { type: "error" });
    }
  }

  async function updateCustomerBillingAddress(billingAddress: RetrieveBilling) {
    try {
      const response = await axios.put(`/api/auth/update`, {
        billing: billingAddress
      });
      getCart();
      fetchData();
      return response.data as RetrieveUserRootObject;
    } catch (e: any) {
      toast(e.message || t("message.fb1ec174b6ac8f409ffa6ebdf48e2666cc5e"), { type: "error" });
    }
  }

  async function updateCustomerShippingAddress(shippingAddress: RetrieveShipping) {
    try {
      const response = await axios.put(`/api/auth/update`, {
        shipping: shippingAddress
      });
      getCart();
      fetchData();
      return response.data as RetrieveUserRootObject;
    } catch (e: any) {
      toast(e.message || t("message.fb1ec174b6ac8f409ffa6ebdf48e2666cc5e"), { type: "error" });
      return Promise.reject(e);
    }
  }

  return { customer, updateCustomer, updateCustomerShippingAddress, updateCustomerBillingAddress };
}
