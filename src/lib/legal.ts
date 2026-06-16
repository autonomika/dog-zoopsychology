import { displayCoursePrice } from "@/lib/pricing";
import {
  PORTFOLIO_SELLER_EMAIL,
  PORTFOLIO_SELLER_NAME,
  SITE_NAME,
  siteUrl,
} from "@/lib/site";

export type LegalInfo = {
  sellerName: string;
  email: string;
  inn: string;
  ogrnip: string;
  address: string;
  appUrl: string;
  price: string;
  courseName: string;
};

export function getLegalInfo(): LegalInfo {
  return {
    sellerName: process.env.LEGAL_SELLER_NAME?.trim() || PORTFOLIO_SELLER_NAME,
    email:
      process.env.LEGAL_SELLER_EMAIL?.trim() ||
      process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ||
      PORTFOLIO_SELLER_EMAIL,
    inn: process.env.LEGAL_SELLER_INN?.trim() || "",
    ogrnip: process.env.LEGAL_SELLER_OGRNIP?.trim() || "",
    address: process.env.LEGAL_SELLER_ADDRESS?.trim() || "",
    appUrl: siteUrl(),
    price: displayCoursePrice(),
    courseName: SITE_NAME,
  };
}

export function sellerDetails(info: LegalInfo) {
  const parts = [info.sellerName];
  if (info.inn) parts.push(`ИНН ${info.inn}`);
  if (info.ogrnip) parts.push(`ОГРНИП ${info.ogrnip}`);
  if (info.address) parts.push(info.address);
  parts.push(`Email: ${info.email}`);
  return parts.join(" · ");
}
