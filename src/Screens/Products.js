// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React from "react";
import { connect } from "../store";
import PropTypes from "prop-types";
import * as date from "../Components/Date";
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import actions from "../Components/Products/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import ConfirmDeleteButton from "../Components/ConfirmDeleteButton";
import _ from "lodash";

export class ProductsScreen extends React.Component {
  componentDidMount() {
    this.props.fetchProducts();
  }

  render() {
    const { products, isFetching } = this.props;
    return (
      <MainContent>
        <TableCard
          title="Products"
          loading={isFetching && !products.length}
          empty={!isFetching && !products.length}
          HeaderButton={
            <a
              id="products__create-product-btn"
              className="pull-right btn btn-primary"
              href="/products/create"
            >
              Create a new product
            </a>
          }
          EmptyComponent={
            <EmptyState
              title="There is no products"
              info="Do you want to create one?"
              button={
                <a className="btn btn-primary" href="/products/create">
                  Create a new product
                </a>
              }
            />
          }
        >
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th>Name</th>
                <th>Label</th>
                <th>Team Owner</th>
                <th>Description</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {_.sortBy(products, [e => e.name.toLowerCase()]).map(
                (product, i) => (
                  <tr key={i}>
                    <td className="text-center">
                      <CopyButton text={product.id} />
                    </td>
                    <td>
                      <a href={`/products/${product.id}`}>{product.name}</a>
                    </td>
                    <td>{product.label}</td>
                    <td>{product.team.name.toUpperCase()}</td>
                    <td>{product.description}</td>
                    <td>{product.from_now}</td>
                    <td className="text-center">
                      <a
                        className="btn btn-primary btn-sm btn-edit"
                        href={`/products/${product.id}`}
                      >
                        <i className="fa fa-pencil" />
                      </a>
                      <ConfirmDeleteButton
                        title={`Delete product ${product.name}`}
                        body={`Are you you want to delete ${product.name}?`}
                        okButton={`Yes delete ${product.name}`}
                        cancelButton="oups no!"
                        whenConfirmed={() => this.props.deleteProduct(product)}
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </TableCard>
      </MainContent>
    );
  }
}

ProductsScreen.propTypes = {
  products: PropTypes.array,
  isFetching: PropTypes.bool,
  errorMessage: PropTypes.string,
  fetchProducts: PropTypes.func
};

function mapStateToProps(state) {
  const { isFetching, errorMessage } = state.products2;
  return {
    products: date.transformObjectsDates(
      state.products2.byId,
      state.currentUser.timezone
    ),
    isFetching,
    errorMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProducts: () => dispatch(actions.all({ embed: "team" })),
    deleteProduct: product => dispatch(actions.delete(product))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsScreen);
