export const DEFAULT_COURSE_PRICE = "1990";

/** Сумма списания — только серверная переменная. */
export function coursePriceRaw() {
  return process.env.COURSE_PRICE?.trim() || DEFAULT_COURSE_PRICE;
}

/** Цена для UI (клиент). Должна совпадать с COURSE_PRICE. */
export function displayCoursePrice() {
  return process.env.NEXT_PUBLIC_COURSE_PRICE?.trim() || coursePriceRaw();
}

export function coursePricesMatch() {
  const server = process.env.COURSE_PRICE?.trim();
  const pub = process.env.NEXT_PUBLIC_COURSE_PRICE?.trim();
  if (!server || !pub) return true;
  return server === pub;
}
