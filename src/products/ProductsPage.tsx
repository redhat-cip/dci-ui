import { CopyButton, EmptyState, ConfirmDeleteModal, Breadcrumb } from "ui";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import {
  Button,
  Content,
  InputGroup,
  InputGroupItem,
  PageSection,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useListProductsQuery,
  useUpdateProductMutation,
} from "./productsApi";
import { useAuth } from "auth/authSelectors";
import LoadingPageSection from "ui/LoadingPageSection";
import ProductIcon from "./ProductIcon";

function ProductsTable() {
  const { data, isLoading } = useListProductsQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const { currentUser } = useAuth();

  if (currentUser === null) return null;

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!data) {
    return <EmptyState title="There is no products" />;
  }

  return (
    <Table aria-label="Products table">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Name</Th>
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
            <Td dataLabel="Name">
              <ProductIcon name={product.name} className="pf-v6-u-mr-xs" />
              {product.name}
            </Td>
            <Td dataLabel="Description">{product.description}</Td>
            <Td className="text-right" isActionCell>
              {currentUser.isSuperAdmin ? (
                <InputGroup>
                  <InputGroupItem>
                    <EditProductModal
                      onSubmit={updateProduct}
                      product={product}
                      isDisabled={isUpdating}
                    />
                  </InputGroupItem>
                  <InputGroupItem>
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
                        >
                          Delete
                        </Button>
                      )}
                    </ConfirmDeleteModal>
                  </InputGroupItem>
                </InputGroup>
              ) : null}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default function ProductsPage() {
  const { currentUser } = useAuth();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  if (currentUser === null) return null;

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
      <ProductsTable />
    </PageSection>
  );
}
