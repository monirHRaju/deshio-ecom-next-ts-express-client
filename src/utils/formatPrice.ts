export const formatPrice = (price: number, currency = "BDT"): string => {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

export const discountedPrice = (price: number, discount: number): number => {
  return price - (price * discount) / 100;
};
