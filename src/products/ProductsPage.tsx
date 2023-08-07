import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import MainPage from "pages/MainPage";
import productsActions from "./productsActions";
import { CopyButton, EmptyState, ConfirmDeleteModal, Breadcrumb } from "ui";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import { getProducts, isFetchingProducts } from "./productsSelectors";
import { Button } from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { AppDispatch } from "store";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

export default function ProductsPage() {
  const currentUser = useSelector(getCurrentUser);
  const products = useSelector(getProducts);
  const isFetching = useSelector(isFetchingProducts);
  const dispatch = useDispatch<AppDispatch>();

  const getAllProducts = useCallback(() => {
    dispatch(productsActions.all());
  }, [dispatch]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  if (currentUser === null) return null;

  return (
    <MainPage
      title="Products"
      description="A product is the main abstraction that describe a Red Hat product (RHEL, OpenStack, Openshift)."
      loading={isFetching && isEmpty(products)}
      empty={!isFetching && isEmpty(products)}
      HeaderButton={
        currentUser.isSuperAdmin ? (
          <CreateProductModal
            onSubmit={(product) => {
              dispatch(productsActions.create(product));
            }}
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
          {products.map((product) => (
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
                      className="pf-v5-u-mr-xs"
                      onSubmit={(editedProduct) => {
                        dispatch(productsActions.update(editedProduct)).finally(
                          () => {
                            getAllProducts();
                          },
                        );
                      }}
                      product={product}
                    />
                    <ConfirmDeleteModal
                      title={`Delete product ${product.name}`}
                      message={`Are you sure you want to delete ${product.name}?`}
                      onOk={() => dispatch(productsActions.delete(product))}
                    >
                      {(openModal) => (
                        <Button variant="danger" onClick={openModal}>
                          <TrashIcon />
                        </Button>
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
