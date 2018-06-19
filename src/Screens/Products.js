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
import Alert from "../Components/Alert";
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import actions from "../Components/Products/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";

export class ProductsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchProducts();
  }

  render() {
    const { products, isFetching, errorMessage } = this.props;
    return (
      <MainContent>
        {errorMessage && !products.length ? (
          <Alert message={errorMessage} />
        ) : null}
        <TableCard
          loading={isFetching && !products.length}
          title="Products"
          headerButton={
            <a className="pull-right btn btn-primary" href="/products/create">
              Create a new product
            </a>
          }
        >
          {!errorMessage && !products.length ? (
            <EmptyState
              title="There is no products"
              info="Do you want to create one?"
              button={
                <a className="btn btn-primary" href="/products/create">
                  Create a new product
                </a>
              }
            />
          ) : (
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
                {products.map((product, i) => (
                  <tr key={i}>
                    <td className="text-center">
                      <CopyButton text={product.id} />
                    </td>
                    <td>
                      <a href={`/products/details/${product.id}`}>
                        {product.name}
                      </a>
                    </td>
                    <td>{product.label}</td>
                    <td>{product.team.name}</td>
                    <td>{product.description}</td>
                    <td>{product.created_at}</td>
                    <td className="text-center">
                      <a
                        className="btn btn-primary btn-sm btn-edit"
                        href={`/products/details/${product.id}`}
                      >
                        <i className="fa fa-pencil" />
                      </a>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        ng-click="$ctrl.deleteProduct(product)"
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
    fetchProducts: () => {
      dispatch(actions.all({ embed: "team" }));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsScreen);
