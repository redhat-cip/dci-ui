import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "../layout";
import productsActions from "./producstActions";
import teamsActions from "../teams/teamsActions";
import { CopyButton, EmptyState } from "../ui";
import NewProductButton from "./NewProductButton";
import EditProductButton from "./EditProductButton";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { getProducts } from "./productSelectors";
import { getTeams } from "../teams/teamsSelectors";

export class ProductsContainer extends Component {
  componentDidMount() {
    this.props.fetchProducts();
  }

  render() {
    const { products, isFetching } = this.props;
    return (
      <Page
        title="Products"
        loading={isFetching && isEmpty(products)}
        empty={!isFetching && isEmpty(products)}
        HeaderButton={<NewProductButton />}
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
              <th className="pf-u-text-align-center">ID</th>
              <th>Name</th>
              <th>Label</th>
              <th>Team Owner</th>
              <th>Description</th>
              <th>Created</th>
              <th className="pf-u-text-align-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={`${product.id}.${product.etag}`}>
                <td className="pf-u-text-align-center">
                  <CopyButton text={product.id} />
                </td>
                <td>{product.name}</td>
                <td>{product.label}</td>
                <td>{product.team ? product.team.name.toUpperCase() : null}</td>
                <td>{product.description}</td>
                <td>{product.from_now}</td>
                <td className="pf-u-text-align-center">
                  <EditProductButton className="pf-u-mr-xl" product={product} />
                  <ConfirmDeleteButton
                    name="product"
                    resource={product}
                    whenConfirmed={product => this.props.deleteProduct(product)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    products: getProducts(state),
    teams: getTeams(state),
    isFetching: state.products.isFetching || state.teams.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProducts: () => {
      dispatch(productsActions.all({ embed: "team" }));
      dispatch(teamsActions.all());
    },
    deleteProduct: product => dispatch(productsActions.delete(product))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsContainer);
