import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "layout";
import productsActions from "./productsActions";
import { CopyButton, EmptyState, ConfirmDeleteModal, Breadcrumb } from "ui";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import { getProducts, isFetchingProducts } from "./productsSelectors";
import { Button } from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { AppDispatch } from "store";

export default function ProductsPage() {
  const products = useSelector(getProducts);
  const isFetching = useSelector(isFetchingProducts);
  const dispatch = useDispatch<AppDispatch>();

  const getAllProducts = useCallback(() => {
    dispatch(productsActions.all());
  }, [dispatch]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  return (
    <Page
      title="Products"
      description="A product is the main abstraction that describe a Red Hat product (RHEL, OpenStack, Openshift)."
      loading={isFetching && isEmpty(products)}
      empty={!isFetching && isEmpty(products)}
      HeaderButton={
        <CreateProductModal
          onSubmit={(product) => {
            dispatch(productsActions.create(product));
          }}
        />
      }
      EmptyComponent={
        <EmptyState
          title="There is no products"
          info="Do you want to create one?"
        />
      }
      breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Products" }]}
        />
      }
    >
      <table className="pf-c-table pf-m-compact pf-m-grid-md">
        <thead>
          <tr>
            <th className="text-center pf-m-width-5">ID</th>
            <th className="pf-m-width-10">Name</th>
            <th className="pf-m-width-10">Label</th>
            <th className="pf-m-width-45">Description</th>
            <th className="pf-m-width-10 text-center">Created</th>
            <th className="text-center pf-m-width-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={`${product.id}.${product.etag}`}>
              <td className="text-center">
                <CopyButton text={product.id} />
              </td>
              <td>{product.name}</td>
              <td>{product.label}</td>
              <td>{product.description}</td>
              <td className="text-center">{product.from_now}</td>
              <td className="text-center">
                <EditProductModal
                  className="mr-xs"
                  onSubmit={(editedProduct) => {
                    dispatch(productsActions.update(editedProduct)).finally(
                      () => {
                        getAllProducts();
                      }
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  );
}
