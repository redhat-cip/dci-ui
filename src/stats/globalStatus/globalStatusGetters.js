export function getGlobalStatusFilters(globalStatus) {
  const productsNames = globalStatus
    .map((stat) => stat.product_name)
    .filter((stat) => stat);
  const uniqueProductsNames = Array.from(new Set(productsNames));
  return uniqueProductsNames.map((productName) => ({ name: productName }));
}
