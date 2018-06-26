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
import _ from "lodash";
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import productsActions from "../Components/Products/actions";
import teamsActions from "../Components/Teams/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import NewProductButton from "../Components/Products/NewProductButton";
import EditProductButton from "../Components/Products/EditProductButton";
import ConfirmDeleteButton from "../Components/ConfirmDeleteButton";
import { getProducts } from "../Components/Products/selectors";

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
          loading={isFetching && _.isEmpty(products)}
          empty={!isFetching && _.isEmpty(products)}
          HeaderButton={<NewProductButton className="pull-right" />}
          EmptyComponent={
            <EmptyState
              title="There is no products"
              info="Do you want to create one?"
              button={<NewProductButton />}
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
              {products.map((product, i) => (
                <tr key={i}>
                  <td className="text-center">
                    <CopyButton text={product.id} />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.label}</td>
                  <td>{product.team.name.toUpperCase()}</td>
                  <td>{product.description}</td>
                  <td>{product.from_now}</td>
                  <td className="text-center">
                    <EditProductButton product={product} />
                    <ConfirmDeleteButton
                      name="product"
                      resource={product}
                      whenConfirmed={product =>
                        this.props.deleteProduct(product)
                      }
                    />
                  </td>
                </tr>
              ))}
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
  fetchProducts: PropTypes.func,
  deleteProduct: PropTypes.func
};

function mapStateToProps(state) {
  return {
    products: getProducts(state),
    isFetching: state.products2.isFetching || state.teams2.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProducts: () => {
      dispatch(productsActions.all());
      dispatch(teamsActions.all());
    },
    deleteProduct: product => dispatch(actions.delete(product))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsScreen);
