import React from "react";
import { MainContent } from "layout";
import NewProductButton from "./NewProductButton";
import {
  Button,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text
} from "@patternfly/react-core";
import { CopyButton, ConfirmDeleteModal } from "ui";
import EditProductButton from "./EditProductButton";
import { TrashIcon } from "@patternfly/react-icons";
import api from "../services/api";

const ProductsPage = () => {
  const { products, status, error, create, update, remove } = api("product");
  return (
    <MainContent>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Products</Text>
          <NewProductButton onSubmit={create} />
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th className="pf-u-text-align-center pf-m-width-5">ID</th>
              <th className="pf-m-width-10">Name</th>
              <th className="pf-m-width-10">Label</th>
              <th className="pf-m-width-50">Description</th>
              <th className="pf-u-text-align-center pf-m-width-25">Actions</th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td colSpan={5}>loading...</td>
              </tr>
            ) : status === "error" ? (
              <tr>
                <td colSpan={5}>
                  Something went wrong when trying to get products
                  <br />
                  {error.message}
                </td>
              </tr>
            ) : (
              <>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5}>There is no product</td>
                  </tr>
                ) : null}
                {products.map(product => (
                  <tr key={`${product.id}.${product.etag}`}>
                    <td className="pf-u-text-align-center">
                      <CopyButton text={product.id} />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.label}</td>
                    <td>{product.description}</td>
                    <td className="pf-u-text-align-center">
                      <EditProductButton
                        className="pf-u-mr-xs"
                        product={product}
                        onSubmit={update}
                      />
                      <ConfirmDeleteModal
                        title={`Delete product ${product.name}`}
                        message={`Are you sure you want to delete ${product.name}?`}
                        onOk={() => remove(product)}
                      >
                        {openModal => (
                          <Button variant="danger" onClick={openModal}>
                            <TrashIcon />
                          </Button>
                        )}
                      </ConfirmDeleteModal>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </PageSection>
    </MainContent>
  );
};

export default ProductsPage;
