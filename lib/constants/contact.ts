export const ContactPhone = "+86-13610076261";
export const ContactEmail = "linda@lefengjewelry.com";
export const ContactFax = "+86-13610076261";

export const FooterLinks: {
  icon: string;
  name: string;
  link?: string;
  click?: () => void;
}[] = [{
  icon: "ri-map-pin-2-line",
  name: "t.common.My_Address",
  link: "/contact"
}, {
  icon: "ri-smartphone-line",
  name: ContactPhone,
  link: `tel:${ContactPhone}`
}, {
  icon: "ri-mail-line",
  name: ContactEmail,
  link: `mailto:${ContactEmail}`
}];


export const ContactFooterSocialMedia = [{
  name:"facebook",
  link: "facebook.com/guangzhoulefengjewelry",
  icon: "ri-facebook-fill"
}, {
  name: "twitter",
  link: "https://twitter.com/LefengJ",
  icon: "ri-twitter-fill"
}, {
  name: "instagram",
  link:"https://www.instagram.com/lefengjewelry/",
  icon:"ri-instagram-line"
},{
  name: "youtube",
  link: "https://www.youtube.com/channel/UCi8pVOlIgy8hs6M3-XY5JtQ",
  icon:"ri-youtube-fill"
},{
  name: "pinterest",
  link: "https://www.pinterest.com/lefengjewelry/",
  icon: "ri-pinterest-fill"
}, {
  name: "linkedin",
  link: "https://www.linkedin.com/company/lefengjewelry/",
  icon: "ri-linkedin-fill"
}];
