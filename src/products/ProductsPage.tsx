import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "layout";
import productsActions from "./productsActions";
import { CopyButton, EmptyState, ConfirmDeleteModal } from "ui";
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

  useEffect(() => {
    dispatch(productsActions.all());
  }, [dispatch]);

  return (
    <Page
      title="Products"
      loading={isFetching && isEmpty(products)}
      empty={!isFetching && isEmpty(products)}
      HeaderButton={<CreateProductModal onSubmit={console.log} />}
      EmptyComponent={
        <EmptyState
          title="There is no products"
          info="Do you want to create one?"
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
                  onSubmit={console.log}
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
/* }

function mapStateToProps(state) {
  return {
    products: getProducts(state),
    isFetching: state.products.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProducts: () => {
      dispatch(productsActions.all());
    },
    deleteProduct: (product) => dispatch(productsActions.delete(product)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsPage);
 */
