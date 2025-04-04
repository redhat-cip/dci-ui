import { EmptyState, ConfirmDeleteModal, Breadcrumb } from "ui";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  Gallery,
  InputGroup,
  InputGroupItem,
  PageSection,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useListProductsQuery,
  useUpdateProductMutation,
} from "./productsApi";
import { useAuth } from "auth/authSelectors";
import LoadingPageSection from "ui/LoadingPageSection";
import ProductIcon from "./ProductIcon";
import { useNavigate } from "react-router";

function ProductsGallery() {
  const navigate = useNavigate();
  const { data, isLoading } = useListProductsQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const { currentUser } = useAuth();

  if (currentUser === null) return null;

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!data || data.products.length === 0) {
    return <EmptyState title="There is no products" />;
  }

  return (
    <Gallery hasGutter>
      {data.products.map((product, key) => (
        <Card isCompact key={product.id} id={product.id}>
          <CardHeader
            actions={{
              actions: currentUser.isSuperAdmin ? (
                <div>
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
                            variant="link"
                            isDanger
                            onClick={openModal}
                          ></Button>
                        )}
                      </ConfirmDeleteModal>
                    </InputGroupItem>
                  </InputGroup>
                </div>
              ) : null,
            }}
          >
            <ProductIcon name={product.name} style={{ fontSize: "1.2rem" }} />
          </CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardBody className="flex flex-col justify-between gap-md">
            <p>{product.description}</p>
            <div>
              <Button
                variant="link"
                onClick={() =>
                  navigate(`/topics?query=eq(product_id,${product.id})`)
                }
              >
                View topics
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </Gallery>
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
      <Content component="p">All available Red Hat products in DCI</Content>
      {currentUser.isSuperAdmin && (
        <div className="pf-v6-u-mb-md">
          <CreateProductModal
            onSubmit={createProduct}
            isDisabled={isCreating}
          />
        </div>
      )}
      <ProductsGallery />
    </PageSection>
  );
}
