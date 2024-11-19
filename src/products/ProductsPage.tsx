import { useEffect, useState } from "react";
import MainPage from "pages/MainPage";
import {
  CopyButton,
  EmptyState,
  ConfirmDeleteModal,
  Breadcrumb,
  InputFilter,
} from "ui";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { useLocation, useNavigate } from "react-router-dom";
import { Filters } from "types";
import {
  createSearchFromFilters,
  parseFiltersFromSearch,
} from "services/filters";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useListProductsQuery,
  useUpdateProductMutation,
} from "./productsApi";
import { useAuth } from "auth/authSelectors";

export default function ProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search),
  );
  const { currentUser } = useAuth();
  const { data, isLoading } = useListProductsQuery(filters);
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/products${newSearch}`, { replace: true });
  }, [navigate, filters]);

  if (!data || currentUser === null) return null;

  return (
    <MainPage
      title="Products"
      description="A product is the main abstraction that describe a Red Hat product (RHEL, OpenStack, Openshift)."
      loading={isLoading}
      empty={data.products.length === 0}
      HeaderButton={
        currentUser.isSuperAdmin ? (
          <CreateProductModal
            onSubmit={createProduct}
            isDisabled={isCreating}
          />
        ) : null
      }
      EmptyComponent={
        <EmptyState
          title="There is no products"
          info="Do you want to create one?"
        />
      }
      Breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Products" }]}
        />
      }
      Toolbar={
        <Toolbar id="toolbar-products" collapseListedFiltersBreakpoint="xl">
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <InputFilter
                  search={filters.name || ""}
                  placeholder="Search a product"
                  onSearch={(name) => {
                    setFilters({
                      ...filters,
                      name,
                    });
                  }}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      }
    >
      <Table aria-label="Products table" variant="compact">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Label</Th>
            <Th>Description</Th>
            <Th textCenter> {currentUser.isSuperAdmin ? "Actions" : ""}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.products.map((product) => (
            <Tr key={`${product.id}.${product.etag}`}>
              <Td dataLabel="ID">
                <CopyButton text={product.id} />
              </Td>
              <Td dataLabel="Name">{product.name}</Td>
              <Td dataLabel="Label">{product.label}</Td>
              <Td dataLabel="Description">{product.description}</Td>
              <Td className="text-center">
                {currentUser.isSuperAdmin ? (
                  <>
                    <EditProductModal
                      className="pf-v6-u-mr-xs"
                      onSubmit={updateProduct}
                      product={product}
                      isDisabled={isUpdating}
                    />
                    <ConfirmDeleteModal
                      title={`Delete product ${product.name}`}
                      message={`Are you sure you want to delete ${product.name}?`}
                      onOk={() => deleteProduct(product)}
                    >
                      {(openModal) => (
                        <Button
                          size="sm"
                          icon={<TrashIcon />}
                          variant="danger"
                          onClick={openModal}
                        ></Button>
                      )}
                    </ConfirmDeleteModal>
                  </>
                ) : null}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </MainPage>
  );
}
