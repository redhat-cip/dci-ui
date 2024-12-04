import { useEffect, useState } from "react";
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
  Content,
  PageSection,
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
import LoadingPageSection from "ui/LoadingPageSection";

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

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (currentUser === null) return null;

  if (!data) {
    return <EmptyState title="There is no products" />;
  }

  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Products" }]} />
      <Content component="h1">Products</Content>
      <Content component="p">
        A product is the main abstraction that describe a Red Hat product (RHEL,
        OpenStack, Openshift).
      </Content>
      {currentUser.isSuperAdmin && (
        <div className="pf-v6-u-mb-md">
          <CreateProductModal
            onSubmit={createProduct}
            isDisabled={isCreating}
          />
        </div>
      )}
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
      {data.products.length === 0 ? (
        <EmptyState title="There is no products" />
      ) : (
        <Table aria-label="Products table">
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
                <Td dataLabel="ID" isActionCell>
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
      )}
    </PageSection>
  );
}
