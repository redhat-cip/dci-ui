export function getUniqueProductsNames(globalStatus) {
  const productsNames = globalStatus
    .map(stat => stat.product_name)
    .filter(stat => stat);
  return Array.from(new Set(productsNames));
}
