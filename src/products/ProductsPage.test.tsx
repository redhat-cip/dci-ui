import { renderWithProviders } from "__tests__/renders";
import ProductsPage from "./ProductsPage";
import { waitFor } from "@testing-library/react";

test("Should display remotecis in remotecis page", async () => {
  const { getByText } = renderWithProviders(<ProductsPage />);
  await waitFor(() => {
    expect(
      getByText("OpenShift is an open source container application platform"),
    ).toBeInTheDocument();
    expect(
      getByText(
        "RHEL is a Linux distribution developed by Red Hat and targeted toward the commercial market",
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        "OpenStack is a free and open-source software platform for cloud computing",
      ),
    ).toBeInTheDocument();
  });
});
