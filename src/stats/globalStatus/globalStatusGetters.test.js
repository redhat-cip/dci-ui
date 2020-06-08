import { getGlobalStatusFilters } from "./globalStatusGetters";

it("getGlobalStatusFilters", () => {
  const productsNames = getGlobalStatusFilters([
    { product_name: "OpenStack" },
    { product_name: "OpenStack" },
    { product_name: "Ansible" },
    { product_name: null },
  ]);
  const exceptedProductsNames = [{ name: "OpenStack" }, { name: "Ansible" }];
  expect(productsNames).toEqual(exceptedProductsNames);
});
