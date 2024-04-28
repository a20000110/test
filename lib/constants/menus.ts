export type Menu = {
  id: number;
  name: string;
  isEditSeo?: boolean;
  isEditPage: boolean;
  link: string;
  icon?: string;
  show?: boolean;
  mobileShow?: boolean;
  children?: Menu[];
}

export const menus: Menu[] = [
  {
    id: 0,
    name: "Home",
    link: "/",
    isEditSeo: true,
    show: false,
    isEditPage: true
  }, {
    id: 2,
    name: "Product",
    link: "/product",
    isEditSeo: true,
    show: false,
    isEditPage: false,
    icon: "ri-arrow-down-s-line",
    children: [
      {
        id: 5,
        name: "Category",
        link: "/product",
        isEditPage: false
      }]
  }, {
    id: 3,
    name: "Blog",
    link: "/blog",
    isEditSeo: true,
    isEditPage: false,
    icon: "/image/menu/blog.svg",
    children: [
      {
        id: 6,
        name: "Blog-Search",
        link: "/blog/search",
        isEditSeo: true,
        isEditPage: false
      }
    ]
  }, {
    id: 1,
    name: "About us",
    link: "/about-us",
    isEditSeo: true,
    isEditPage: true,
    mobileShow: true,
    show: false
  }, {
    id: 4,
    name: "Contact Us",
    link: "/contact",
    isEditSeo: true,
    isEditPage: true,
    icon: "/image/menu/contact.svg"
  }, {
    id: 7,
    name: "Cookie Policy",
    link: "/cookie-policy",
    isEditSeo: true,
    isEditPage: true,
    show: false
  }, {
    id: 8,
    name: "Checkout",
    link: "/checkout",
    isEditSeo: false,
    show: false,
    isEditPage: false
  }, {
    id: 9,
    name: "Center",
    link: "/center",
    isEditSeo: false,
    isEditPage: false,
    show: false,
    children: [{
      id: 10,
      name: "Setting",
      link: "/center/setting",
      isEditPage: false,
      show: false,
      isEditSeo: true
    }, {
      id: 11,
      name: "Inquiry",
      link: "/center/inquiry",
      show: false,
      isEditSeo: false,
      isEditPage: false
    }, {
      id: 12,
      name: "Order",
      link: "/center/order",
      show: false,
      isEditSeo: false,
      isEditPage: false
    }]
  }, {
    id: 13,
    name: "Preview",
    link: "/preview",
    show: false,
    isEditSeo: false,
    isEditPage: false
  }, {
    id: 18,
    name: "Collection",
    link: "/collection",
    show: false,
    isEditPage: false,
    isEditSeo: true
  }, {
    id: 19,
    name: "Compare",
    link: "/compare",
    show: false,
    isEditPage: false,
    isEditSeo: true
  }, {
    id: 21,
    name: "Search",
    link: "/search",
    show: false,
    isEditPage: false,
    isEditSeo: true
  }, {
    id: 24,
    name: "Inquiry",
    link: "/inquiry",
    show: false,
    isEditPage: false,
    isEditSeo: false
  }, {
    id: 25,
    name: "Return Policy",
    link: "/return-policy",
    show: false,
    isEditPage: true,
    isEditSeo: true
  }, {
    id: 26,
    name: "Privacy Policy",
    link: "/privacy-policy",
    show: false,
    isEditPage: true,
    isEditSeo: true
  }, {
    id: 27,
    name: "Wholesale Inquiries",
    link: "/wholesale-inquiries",
    show: false,
    isEditPage: true,
    isEditSeo: true
  }, {
    id: 27,
    name: "Shipping & Returns",
    link: "/shipping-returns",
    show: false,
    isEditPage: true,
    isEditSeo: true
  }, {
    id: 28,
    name: "Best Sellers",
    link: "/best-sellers",
    show: false,
    isEditSeo: true,
    isEditPage: false
  }
];
