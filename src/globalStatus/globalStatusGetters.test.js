import { getUniqueProductsNames } from "./globalStatusGetters";

it("get products' names", () => {
  const productsNames = getUniqueProductsNames([
    { product_name: "OpenStack" },
    { product_name: "OpenStack" },
    { product_name: "Ansible" },
    { product_name: null }
  ]);
  const exceptedProductsNames = ["OpenStack", "Ansible"];
  expect(productsNames).toEqual(exceptedProductsNames);
});
